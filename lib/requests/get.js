// Get requests
function get(request, fn) {
  var format = request.path.match(/.*\.(.*)/)[1] || 'html'
  socStore.getAll(function(act) {

    var activities = _.sortBy(act, function(activity) {
      return -activity.published;
    });

    switch (format){
      case 'json':
      fn({headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(activities)});
      break;
      case 'atom':
      var templ = '<?xml version="1.0" encoding="UTF-8"?>\
      <feed xmlns="http://www.w3.org/2005/Atom">\
      <title>My Butler</title>\
      <link rel="hub" href="http://pubsubhubbub.superfeedr.com/"/>\
      <link rel="self" href=""/>\
      <updated></updated>\
      {{#activities}}\
      <entry>\
      <title>{{title}}</title>\
      <link href=""/>\
      <published>{{published}}</published>\
      <updated>{{published}}</updated>\
      <id>{{id}}</id>\
      <content type="html">{{content}}</content>\
      <author>\
      <name>{{actor.displayName}}</name>\
      <uri>{{actor.url}}</uri>\
      </author>\
      </entry>\
      {{/activities}}\
      </feed>\
      ';
      var output = Mustache.render(templ, {activities: activities});
      fn({headers: {
        'Content-Type': 'application/atom+xml'
      }, body: output});
      break;
      default :
      var templ = '<ul>{{#activities}}<li>{{title}}, on {{provider.displayName}}</li>{{/activities}}</ul>';
      var output = Mustache.render(templ, {activities: activities});
      fn({headers: {
        'Content-Type': 'text/html; charset=UTF-8'
      }, body: output});

    }
  });
}
