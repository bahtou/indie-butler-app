// Get requests
function get(request, fn) {

  if(request.path.match("/entry/.*")) {
    var format = "html";
    var id = "";
    if(request.path.match(/\/entry\/(.*)\.(.*)/)) {
      format = request.path.match(/\/entry\/(.*)\.(.*)/)[2];
      id = request.path.match(/\/entry\/(.*)\.(.*)/)[1];
    }
    else if(request.path.match(/\/entry\/(.*)/)) {
      id = request.path.match(/\/entry\/(.*)/)[1];
    }
    if(id !== "") {
      socStore.get(id, function(obj) {
      console.log(obj);
      switch (format){
        case 'json':
        fn({headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(obj)});
        break;
        default :
        var templ = '<h1>{{title}}</h1><span>{{verb}}ed by <a href="{{actor.url}}">{{actor.displayName}}</a> on {{provider.displayName}}</span>';
        var output = Mustache.render(templ, obj);
        fn({headers: {
          'Content-Type': 'text/html; charset=UTF-8'
        }, body: output});
      }
    }, function() {
      fn({headers: {
        'Content-Type': 'text/html; charset=UTF-8'
      }, body: "Not Found"});
    });

    }
    else {
      fn({headers: {
        'Content-Type': 'text/html; charset=UTF-8'
      }, body: "Not Found"});
    }
  }
  else if(request.path.match("/stream.*")) {
    var format = "html";
    if(request.path.match(/\w*\.(.*)/)) {
      format = request.path.match(/\w*\.(.*)/)[1];
    }
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
        var templ = '<ul>{{#activities}}<li><a href="/entry/{{id}}">{{title}}</a>, on {{provider.displayName}}</li>{{/activities}}</ul>';
        var output = Mustache.render(templ, {activities: activities});
        fn({headers: {
          'Content-Type': 'text/html; charset=UTF-8'
        }, body: output});
      }
    });
  }
  else {
    fn({headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }, body: "Not Found"});
  }
}
