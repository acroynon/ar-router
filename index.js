let Handler = require("./HandlerFunctions");
let Matcher = require("./MatcherFunctions");
let RequestMethod = require("./RequestMethod");
let RouteType = require("./RouteType");

function Router(options){
  this.routes = [];
}

Router.prototype.register = function(options){
  this.routes.push({
    requestMethod : options.requestMethod || RequestMethod.GET,
    path: options.path,
    callback: options.callback,
    caseInsensitive: options.caseInsensitive || true,
    type: options.type || RouteType.SIMPLE
  })
}

Router.prototype.registerPage = function(requestedRoute, pageLocation){
  this.routes.push({
    requestMethod : RequestMethod.GET,
    path : requestedRoute,
    pageLocation : pageLocation,
    type: RouteType.PAGE
  })
}

Router.prototype.registerStaticFolder = function(requestedRoute, folderLocation){
  this.routes.push({
    requestMethod : RequestMethod.GET,
    path : requestedRoute,
    folderLocation : folderLocation,
    type: RouteType.FOLDER
  })
}

Router.prototype.handle = function(req, res){
  var routeExists = false;
  for(route of this.routes){
    if(Matcher.routeMatches(req, route)){
      routeExists = handleRoute(req, res, route);
      if(routeExists){
        break;
      }
    }
  }
  if(!routeExists){
    res.write("404");
  }

  res.end();
}

function handleRoute(req, res, route){
    var result = false;
    switch(route.type){
      case RouteType.SIMPLE:
          result = Handler.handleSimple(req, res, route);
          break;
      case RouteType.PAGE:
          result = Handler.handlePage(req, res, route);
          break;
      case RouteType.FOLDER:
          result = Handler.handleFolder(req, res, route);
    }
    return result;
}

module.exports = { Router, RequestMethod, RouteType }
