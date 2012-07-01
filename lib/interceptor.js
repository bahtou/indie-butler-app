/* Let's see with Twitter */
$(".tweet-button").live('click', function(evt) {
  console.log("clicked");
  var content = $('.twitter-anywhere-tweet-box-editor').val();

  var activity = {
        "actor": {
            "displayName": $("b.fullname:first").text(),
            "id": "http:\/\/twitter.com" + $(".account-summary:first").attr('href'),
            "objectType": "person",
            "url": "http:\/\/twitter.com" + $(".account-summary:first").attr('href')
        },
        "content": content,
        "object": {
            "displayName": content,
            "objectType": "note",
            "content": content
        },
        "published": new Date().getTime(),
        "provider": {
            "objectType": "service",
            "displayName": "Twitter",
            "url": "http:\/\/twitter.com\/"
        },
        "title": content,
        "verb": "post"
    };

    // And now, let's send that to the background page, so it can save it!
    chrome.extension.sendRequest(activity, function(){
      // Not care.
    });
});
