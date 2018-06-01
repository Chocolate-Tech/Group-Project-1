var config = {
    apiKey: "AIzaSyBfN9DxXyD8bz01rlMmBrEI-SFI3ZnrP8s",
    authDomain: "bootcamp-group-project-one.firebaseapp.com",
    databaseURL: "https://bootcamp-group-project-one.firebaseio.com",
    projectId: "bootcamp-group-project-one",
    storageBucket: "bootcamp-group-project-one.appspot.com",
    messagingSenderId: "1015568709056"
};
firebase.initializeApp(config);

database = firebase.database();

var loggedInUsername = "";
var storedUserName = localStorage.getItem("username");

var currentUrl = window.location.href;
var start = currentUrl.lastIndexOf("room.html?") + 11;
var roomKey = currentUrl.substring(start, start + 19);
database.ref("/rooms").once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        if (childKey == `-${roomKey}`) {
            loadData(childSnapshot.val());
        }
    });
});

function loadData(roomData) {
    $(document).ready(function () {

        $(window).bind('beforeunload', function () {
            var ref = database.ref(`/rooms/-${roomKey}`);
            var hostLeft = false;
            ref.once("value", function (snapshot) {
                if (snapshot.val().host == localStorage.getItem("username")) {
                    hostLeft = true;
                }
            });
            if (hostLeft){
                ref.remove();
            }
        });

        $("#dropdown-section > div").on("click", "a", function () {
            $("#dropdown-section > button").text($(this).text());
        });

        $("#search-button").on("click", function () {
            if (!$("#collapseExample").hasClass("show")) {
                searchFunction();
            } else {
                $("#video-preview").empty();
            }
        });

        $("#Searchword").on("keydown", function (event) {
            var pressedKey = event.key.toLowerCase();
            if (pressedKey == "enter") {
                $("#collapseExample").addClass("show");
                searchFunction();
            }
        });

        function searchFunction() {
            $("#video-preview").empty();
            var searchWord = $("#Searchword").val();
            var videoPreview = $("#video-preview");
            if ($("#dropdown-section > button").text() == "YouTube Videos")
                callYouTubeAPI(searchWord, videoPreview);
            else
                callTwitchAPI(searchWord, videoPreview);
        }

        $("#video-preview").on("click", ".thumbnail-preview", function () {

            if ($("#dropdown-section > button").text() == "YouTube Videos") {
                var videoId = $(this).attr("video-id");
                roomData.url = "https://www.youtube.com/embed/" + videoId;
            } else {
                var videoUrl = $(this).attr("video-url");
                roomData.url = videoUrl;
            }

            database.ref(`/rooms/-${roomKey}`).set(roomData);
            $("#video-row > iframe").attr("src", roomData.url);
            $("#video-preview").empty();
            $("#collapseExample").removeClass("show");
        });

        var privateRoomData = database.ref(`/rooms/-${roomKey}`)
        privateRoomData.on("value", function (snapshot) {
            var databaseUrl = snapshot.val().url;
            roomData.url = databaseUrl;
            $("#video-row > iframe").attr("src", roomData.url);
        });

        var messagesRef = database.ref(`/rooms/-${roomKey}/messages`);

        if (typeof (storedUserName) != "undefined" && storedUserName != null) {
            loggedInUsername = storedUserName;
        } else {
            $("#send-message-button").attr("disabled", "");
            $("#message-text").attr("disabled", "");
        }

        var argument;

        var commands = {
            "clearchat": function () {
                $("#message-history").empty()
            },
            "emptydb": function () {
                emptyDatabase()
            },
            "play": function (argument) {
                callAPI($("#video-row"), argument);
            }
        }


        $("#send-message-button").on("mouseup", function (event) {
            if (event.which == 1) {
                sendMessage($("#message-text"));
            }
        });

        $("#clear-messages").on("mouseup", function (event) {
            if (event.which == 1) {
                emptyDatabase();
            }
        });

        function emptyDatabase() {
            messagesRef.remove();
            $("#message-history").empty();
        }

        $("#message-text").on("keydown", function (event) {
            var pressedKey = event.key.toLowerCase();
            if (pressedKey == "enter") {
                sendMessage($("#message-text"));
            }
        });

        messagesRef.once("value", function (snapshot) {
            if (snapshot.val() !== null) {

                var myObj = snapshot.val();
                var lastKeyInMessages = Object.keys(myObj)[Object.keys(myObj).length - 1];
                Object.keys(myObj).forEach(key => key != lastKeyInMessages ? updateMessageHistory(myObj[key]) : {});
            }
            messagesRef.limitToLast(1).on("child_added", function (snapshot) {
                updateMessageHistory(snapshot.val());
            }, function (error) {

            });
        });

        function sendMessage(inputElement) {
            var message = `${inputElement.val()}`;
            if (message[0] == "/") {
                message = message.substring(1, message.length).toLowerCase();
                var commandArguments = message.split(" ");
                command = commandArguments[0];

                if (commandArguments > 1) {
                    argument = commandArguments[1];
                }
                Object.keys(commands).find(commandKey => {
                    if (commandKey in commands && commandKey == command) {
                        commands[commandKey](argument);
                    }
                });

            } else if (message !== '') {
                messagesRef.push(`${loggedInUsername}: ${inputElement.val()}`);
            }
            inputElement.val("");
        }

        function updateMessageHistory(message) {
            var newDiv = $("<div>");
            newDiv.text(message);
            $("#message-history").append(newDiv);
        }
    });
}