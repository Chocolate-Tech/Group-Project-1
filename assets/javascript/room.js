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


$("#send-message-button").on("mouseup", function (event) {
    if (event.which == 1) {
        var message = `${$("#message-text").val()}`;
        if (message !== '') {
            database.ref("/messages").push($("#message-text").val());
        }
        $("#message-text").val("");
    }
});

$("#clear-messages").on("mouseup", function (event) {
    if (event.which == 1) {
        database.ref("/messages").remove();
        $("#message-history").empty();
    }
});

database.ref("/messages").once("value", function (snapshot) {
    if (snapshot.val() !== null) {
        
        var myObj = snapshot.val();
        var lastKeyInMessages = Object.keys(myObj)[Object.keys(myObj).length - 1];
        Object.keys(myObj).forEach(key => key != lastKeyInMessages ? updateMessageHistory(myObj[key]):{});
    }
    database.ref("/messages").limitToLast(1).on("child_added", function (snapshot) {
        updateMessageHistory(snapshot.val());
    }, function (error) {

    });
});




function updateMessageHistory(message) {
    var newDiv = $("<div>");
    newDiv.text(message);
    $("#message-history").append(newDiv);
}