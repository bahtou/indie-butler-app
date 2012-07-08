function ping(url, fn) {
  var params = {
    'hub.topic': url,
    'hub.mode': 'publish',
    'hub.url': 'http://pubsubhubbub.superfeedr.com'
  };
  jQuery.get('http://pubsubjubhub.appspot.com/', params, function(data, status) {
    if(data.code === "204") {
      fn(null, data.body);
    }
    else {
      fn("Error", data);
    }
  });
}
