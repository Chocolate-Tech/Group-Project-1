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

$(document).ready(function () {
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
        database.ref("/messages").remove();
        $("#message-history").empty();
    }

    $("#message-text").on("keydown", function (event) {
        var pressedKey = event.key.toLowerCase();
        if (pressedKey == "enter") {
            sendMessage($("#message-text"));
        }
    });

    database.ref("/messages").once("value", function (snapshot) {
        if (snapshot.val() !== null) {

            var myObj = snapshot.val();
            var lastKeyInMessages = Object.keys(myObj)[Object.keys(myObj).length - 1];
            Object.keys(myObj).forEach(key => key != lastKeyInMessages ? updateMessageHistory(myObj[key]) : {});
        }
        database.ref("/messages").limitToLast(1).on("child_added", function (snapshot) {
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
            database.ref("/messages").push(`${loggedInUsername}: ${inputElement.val()}`);
        }
        inputElement.val("");
    }

    function updateMessageHistory(message) {
        var newDiv = $("<div>");
        newDiv.text(message);
        $("#message-history").append(newDiv);
    }

    $("#login-button").on("click", function (event) {
        var account = {
            username: $("#login-username").val(),
            password: $("#login-password").val()
        }
        var ref = firebase.database().ref("/accounts");

        var doesExist = false;

        ref.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.username == account.username &&
                    childData.password == account.password) {
                    loggedInUsername = childData.username;
                }
            });
        });

        console.log("success");
    });

    $("#register-button").on("click", function (event) {
        var account = {
            username: $("#register-username").val(),
            password: $("#register-password").val()
        }

        var ref = firebase.database().ref("/accounts");

        ref.once('value', function (snapshot) {
            var doesExist = false;
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log(childData);
                if (childData.username == account.username) {
                    doesExist = true;
                }
            });
            if (!doesExist) {
                ref.push(account);
            }

        });
    });
});