define(function () {
    //Do setup work here

    var app = function() {
      this._get_routes = {};
    };

    app.prototype.handle = function(request, response, proceed) {
      var foundRoute = false;
      switch (request.method) {
        case 'get':
          for(var m in this._get_routes) {
            if(request.path.match(m)) {
              foundRoute = true;
              this._get_routes[m](request, response, function() {
                proceed();
              })
              break;
            }
          }
          if(!foundRoute) {
            response.status = 404;
            response.body = "Not Found";
            proceed();
          }
        break;
        default:
          response.status = 404;
          response.body = "Not Found";
          proceed();
      }
    };

    app.prototype.get = function(matcher, handler) {
      this._get_routes[matcher] = handler;
    }

    return new app();
});
