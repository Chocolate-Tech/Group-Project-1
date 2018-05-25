$(document).ready(function () {

    var queryTwitchURL = "https://api.twitch.tv/kraken/search/streams";
    var clientID = "vpbsez8qfdzsizxzc6f7hft18wsqya";
    var limitResultsNum = 5;
    var searchWordTwitch = "overwatch"

    queryTwitchURL += "?" + $.param({
        "client_id": clientID,
        "limit": limitResultsNum,
        "q": searchWordTwitch

    });
    console.log(queryTwitchURL);
    $.ajax({
        url: queryTwitchURL,
        headers: { "Client-ID": clientID },
        method: "GET",

    }).then(function (response) {
        console.log(response);
        for (item of response.streams) {
            var vidDiv = $("<iframe>");
            vidDiv.attr("id", `${item._id}`);
            vidDiv.attr("src", `http://player.twitch.tv/?video=v${item._id}`)
            vidDiv.attr("frameborder", "0");
            vidDiv.attr("allowfullscreen", "true");
            vidDiv.attr("scrolling", "no");
            vidDiv.attr("width", "400");
            vidDiv.attr("height", "300");
            $("#video-row").append(vidDiv);
        }
    });


});
