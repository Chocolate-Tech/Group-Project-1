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
var storedUserName = sessionStorage.getItem("username");

$(document).ready(function () {

    if (typeof(storedUserName) != "undefined" && storedUserName != null){
        loggedInUsername = storedUserName;
    }
    else{
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
});