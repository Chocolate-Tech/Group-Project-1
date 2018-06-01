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

$(document).ready(function () {
    $("#lobbyButton").on("mousedown", function (event) {
        var roomKey = makeRoom(localStorage.getItem("username"));
        if (roomKey != null)
            window.location.href = `room.html?${roomKey}`;
    });
    $("#login-button").on("click", function (event) {
        event.preventDefault();
        var account = {
            username: $("#username-input").val(),
            password: $("#password-input").val()
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
                    storeUsername(account.username);
                    window.location.replace("frontpage.html");
                    doesExist = true;
                }
            });
            if (!doesExist) {
                $("#serverResponse").text("That username/password is incorrect!");
            }
        });
    });

    $("#register-button").on("click", function (event) {
        event.preventDefault();
        var account = {
            username: $("#username-input").val(),
            password: $("#password-input").val()
        }

        var ref = firebase.database().ref("/accounts");

        ref.once('value', function (snapshot) {
            var doesExist = false;
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.username == account.username) {
                    doesExist = true;
                }
            });
            if (!doesExist) {
                ref.push(account);
                $("#serverResponse").text("You have successfully registered! ");
                storeUsername(account.username);
            } else {
                $("#serverResponse").text(`The username "${account.username}" is already taken.`);
            }
        });
    });
});

function makeRoom(username) {
    if (username != null && typeof (username) != "undefined") {
        var initialRoomData = {
            host: username,
            url: ""
        }
        var newRoom = database.ref("/rooms").push(initialRoomData);
        return newRoom.key;
    }
    return null;
}


function storeUsername(username) {
    localStorage.setItem("username", username);
}