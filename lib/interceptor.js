
/* Let's see with Twitter */
$(".tweet-button").live('click', function(evt) {
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

/* And now, Facebook */
$("form.attachmentForm").submit(function(evt) {
  var vals = $("form.attachmentForm").serializeArray();
  var o = {};
   $.each(vals, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });

   var activity = {
    "actor": {
      "displayName": $(".fbxWelcomeBoxName").text(),
      "id": $(".fbxWelcomeBoxName").attr('href'),
      "objectType": "person",
      "url": $(".fbxWelcomeBoxName").attr('href')
    },
    "content": o.xhpc_message,
    "object": {
      "displayName": o.xhpc_message_text,
      "objectType": "note",
      "content": o.xhpc_message
    },
    "published": new Date().getTime(),
    "provider": {
      "objectType": "service",
      "displayName": "Facebook",
      "url": "http:\/\/facebook.com\/"
    },
    "location": {
      "objectType": "place",
      "displayName": $('.cityName').text(),
    },
    "title": o.xhpc_message,
    "verb": "post"
  };

    // And now, let's send that to the background page, so it can save it!
    chrome.extension.sendRequest(activity, function(){
      // Not care.
    });

});
