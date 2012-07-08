define(["../../lib/vendor/IDBStore.js", "../../lib/utils/router.js"], function(IDBStore, app) {

  app.store = new IDBStore();

  // Getting the main stream.
  app.get('/stream*', function(request, response, next) {
    var format = "html";
    if(request.path.match(/\w*\.(.*)/)) {
      format = request.path.match(/\w*\.(.*)/)[1];
    }
    app.store.getAll(function(act) {
      var activities = _.sortBy(act, function(activity) {
        return -activity.published;
      });

      switch (format){
        case 'json':
        response.headers['Content-Type'] = 'application/json';
        response.body = JSON.stringify(activities);

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
        response.headers['Content-Type'] = 'application/atom+xml';
        response.body = output;
        break;
        default :
        var templ = '<h1>Your activities</h1><ul>{{#activities}}<li><a href="/entry/{{id}}">{{title}}</a>, on {{provider.displayName}}</li>{{/activities}}</ul>';
        var output = Mustache.render(templ, {activities: activities});
        response.headers['Content-Type'] = 'text/html; charset=UTF-8';
        response.body = output;
      }
      next();
    });
  });

  // Getting an individual entry
  app.get('/entry/.*', function(request, response, next) {
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
      app.store.get(id, function(obj) {
      switch (format){
        case 'json':
        response.headers['Content-Type'] = 'application/json';
        response.body = JSON.stringify(obj);
        next();
        break;
        default :
        var templ = '<h1>{{title}}</h1><span>{{verb}}ed by <a href="{{actor.url}}">{{actor.displayName}}</a> on {{provider.displayName}}</span>';
        var output = Mustache.render(templ, obj);
        response.headers['Content-Type'] = 'text/html; charset=UTF-8';
        response.body = output;
        next();
      }
      }, function() {
        response.status = 404;
        response.body = output;
        next();
      });
    }
    else {
      response.status = 404;
      response.body = output;
      next();
    }
  });

  return app;
});

