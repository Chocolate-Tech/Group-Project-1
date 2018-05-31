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
    $("#create-lobby-button").on("mousedown", function (event) {
        var roomKey = makeRoom(localStorage.getItem("username"));
        if (roomKey != null)
            window.location.href = `../room.html?${roomKey}`;
        else {
            console.log("!Error, make message for user!");
        }
    });
});

function makeRoom(username) {
    if (username != null && typeof (username) != "undefined") {
        var initialRoomData = {
            host: username
        }
        var ref = firebase.database().ref("/rooms");
        ref.push(initialRoomData).then((snap) => {
            return snap.key;
        });
        return null;
    }
    return null;
}