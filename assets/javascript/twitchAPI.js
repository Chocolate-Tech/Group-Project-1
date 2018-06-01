var queryTwitchURL = "https://api.twitch.tv/kraken/search/streams";
var clientID = "vpbsez8qfdzsizxzc6f7hft18wsqya";
var limitResultsNum = 9;

function callTwtichAPI(searchWordTwitch, appendToElement) {
    queryTwitchURL += "?" + $.param({
        "client_id": clientID,
        "limit": limitResultsNum,
        "q": searchWordTwitch

    });
    $.ajax({
        url: queryTwitchURL,
        headers: { "Client-ID": clientID },
        method: "GET",

    }).then(function (response) {
        for (item of response.streams) {
            var parentDiv = $('<div class="thumbnail-preview">');
            parentDiv.attr("video-url", `https://player.twitch.tv/?autoplay=false&channel=${item.channel.name}`);
            var thumbnailTitle = $("<h6>");
            var imageTag = $("<img>");
            imageTag.attr("src", item.preview.medium);
            thumbnailTitle.text(item.channel.status);
            parentDiv.append(thumbnailTitle);
            parentDiv.append(imageTag);
            // var vidDiv = $("<iframe>");
            // //vidDiv.attr("id", `${item._id}`);
            // vidDiv.attr("src", `https://player.twitch.tv/?autoplay=false&channel=${item.channel.name}`);
            // vidDiv.attr("frameborder", "0");
            // vidDiv.attr("allowfullscreen", "true");
            // vidDiv.attr("scrolling", "no");
            // vidDiv.attr("width", "400");
            // vidDiv.attr("height", "300");
            appendToElement.append(parentDiv);
        }
    });
}