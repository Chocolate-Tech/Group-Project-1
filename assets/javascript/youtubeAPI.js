var apiKey = "AIzaSyDt6-WGGLUcKRju0i7gv0dw1Nqfl-wGE1I";
var resultsNum = 9;
var queryURL = "https://www.googleapis.com/youtube/v3/search";

function callYouTubeAPI(searchWord, appendToElement) {
    queryURL += "?" + $.param({
        "key": apiKey,
        "maxResults": resultsNum,
        "q": searchWord,
        "part": "snippet",
        "type": "video",
        "videoDefinition": "high",
        "videoEmbeddable": "true",
        "videoCaption": "closedCaption"

    });
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        for (item of response.items) {
            var parentDiv = $('<div class="thumbnail-preview">');
            parentDiv.attr("video-id",item.id.videoId);
            var thumbnailTitle = $("<h6>");
            var imageTag = $("<img>");
            imageTag.attr("src",item.snippet.thumbnails.default.url);
            thumbnailTitle.text(item.snippet.title);
            parentDiv.append(thumbnailTitle);
            parentDiv.append(imageTag);

            // var vidElement = $("<iframe>");
            // vidElement.attr("src", "https://www.youtube.com/embed/" + item.id.videoId);
            // vidElement.attr("frameborder", "0");
            // vidElement.attr("allow", "encrypted-media");
            // vidElement.attr("allowfullscreen", "");
            appendToElement.append(parentDiv);
        };


    });
    queryURL = "https://www.googleapis.com/youtube/v3/search";
};