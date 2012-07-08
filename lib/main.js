// <script src="../../lib/requests/get.js"></script>
// <script src="../../lib/ping.js"></script>

require(["../../lib/routes.js", "../../lib/utils/ping.js"], function(app, ping) {
  var socStore = new IDBStore();

  var domain = localStorage.getItem("domain");
  var ioOptions = {
    'max reconnection attempts' : 100000,
    'reconnection limit'        : 1000 * 60 * 10,
    'reconnect'                 : true,
    'force new connection'      : true,
  };

  if(domain) {
    console.log('Butler up!', domain);
    var relay = 'http://butler.' + domain + "";
    var socket = io.connect(relay, ioOptions);
    socket.on('connect', function() {
      console.log('connected as', domain);
      socket.on('session', function(sid) {
        var params = {
          'redirect_uri': relay + '/authed/' + sid,
          'me': domain,
        };
        console.log('authenticating');
        jQuery.get('http://indieauth.com/auth', params, function(data, status, jqXHR) {
          if(data.bound == true && data.domain === domain) {
            // Awesome... we are connected!
          }
          else {
            // For some reason, we couldn't auth the user... Let's just try into a regular window/tab, so that the user can resolve that...
            window.open("http://indieauth.com/auth?redirect_uri=" + relay + "/authed/" + sid + "&me=" + domain + "&human");
          }
        });
      });

      /* requests*/
      socket.on('request', function (request, fn) {
        var req = request;
        var resp = {body: "", headers: {}, status: 200};
        app.handle(req, resp, function() {
          fn(resp);
        });
      });
    });
    socket.on('disconnect', function() {
      console.log('disconnected');
    });
  }


  chrome.extension.onRequest.addListener(function(activity, sender, fn) {
    if(activity.request) {
      var req = activity.request;
      var resp = {body: "", headers: {}};
      app.handle(req, resp, function() {
        fn(resp);
      });
    }
    else {
      if(typeof(activity.id) === 'undefined') {
        activity.id = Math.random().toString(36).substring(8);
      }
      socStore.put(activity);
      ping('http://butler.' + domain + '/stream.atom', function(err, obj) {
        console.log('Hub pinged');
      });
    }
  });
});

