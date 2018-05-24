var apiKey = "AIzaSyDt6-WGGLUcKRju0i7gv0dw1Nqfl-wGE1I"
var limitNum = "5"
var searchWord = "football"
var queryURL = "https://www.googleapis.com/youtube/v3/search" 

queryURL+="?"+$.param({
    "key":apiKey,
    // "limit":limitNum,
    "q":searchWord,
    "part":"snippet",
    // "order":"rating",
    "type":"video",
    // "videoDefinition":"high",
    "videoEmbeddable":"true",
    "videoCaption":"closedCaption"

});
    console.log(queryURL);
$.ajax({
url: queryURL,
method: "GET",
}).then(function(response) {
    console.log(response);
    for(item of response.items){
        var vidElement =$("<iframe>");
        vidElement.attr("src","https://www.youtube.com/embed/"+item.id.videoId);
        vidElement.attr("frameborder","0");
        vidElement.attr("allow","encrypted-media");
        vidElement.attr("allowfullscreen","");
        $("#video-row").append(vidElement);
    };
  });