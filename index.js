// handled different type of requests: GET, POST , etc
// return json objects (REST-Y)
// return static files (disallow directory traversal)
  // router.addStaticFolder(folderLocation, <optional> mappedUrlPrefix)
// dynamic routes with variables /series/:number/whatevs
  // give them back to the dev to use
//
let fs = require("fs");


function Router(options){
  this.routes = [];
}

Router.prototype.register = function(options){
  this.routes.push({
    requestMethod : options.requestMethod || Router.RequestMethod.GET,
    path: options.path,
    callback: options.callback,
    caseInsensitive: options.caseInsensitive || true,
    type: options.type || Router.RouteType.SIMPLE
  })
}

Router.prototype.registerPage = function(requestedRoute, pageLocation){
  this.routes.push({
    requestMethod : Router.RequestMethod.GET,
    path : requestedRoute,
    pageLocation : pageLocation,
    type: Router.RouteType.PAGE
  })
}

Router.prototype.registerStaticFolder = function(requestedRoute, folderLocation){
  this.routes.push({
    requestMethod : Router.RequestMethod.GET,
    path : requestedRoute,
    folderLocation : folderLocation,
    type: Router.RouteType.FOLDER
  })
}

Router.prototype.handle = function(req, res){
  var routeExists = false;
  for(route of this.routes){
    if(routeMatches(req, route)){
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

function routeMatches(req, route){
  return (
    route.requestMethod == req.method &&
    pathEquals(req.url, route)
  );
}

function handleRoute(req, res, route){
    var result = false;
    switch(route.type){
      case Router.RouteType.SIMPLE:
          result = handleSimple(req, res, route);
          break;
      case Router.RouteType.PAGE:
          result = handlePage(req, res, route);
          break;
      case Router.RouteType.FOLDER:
          result = handleFolder(req, res, route);
    }
    return result;
}

function handleSimple(req, res, route){
  res.write(JSON.stringify(route.callback(getPathParams(req.url, route.path))));
  return true;
}

function handlePage(req, res, route){
  if(fs.existsSync(route.pageLocation)){
    let file = fs.readFileSync(route.pageLocation);
    res.write(file);
    return true;
  }
}

function handleFolder(req, res, route){
  var sub = req.url.substring(route.path.length);
  var fileLocation = route.folderLocation + sub;
  if(fs.existsSync(fileLocation)){
    let file = fs.readFileSync(fileLocation);
    res.write(file);
    return true;
  }
}

Router.RequestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  ANY: "ANY"
}

Router.RouteType = {
  SIMPLE: "SIMPLE",
  PAGE: "PAGE",
  FOLDER: "FOLDER"
}


//private functions
function pathEquals(requested, route){
  if(requested == route.path){ return true; }
  var requestArr = requested.split("/");
  var expectedArr = route.path.split("/");
  if(requestArr.length != expectedArr.length && route.type == Router.RouteType.SIMPLE){
      return false;
  }
  for(let i=0; i<expectedArr.length; i++){
    var r = requestArr[i];
    var e = expectedArr[i];
    if(!((route.type == Router.RouteType.SIMPLE && isVariable(e)) || stringEquals(r, e, route.caseInsensitive))){
      return false;
    }
  }
  return true
}

function stringEquals(a, b, caseInsensitive){
  return (caseInsensitive && a.toLowerCase() == b.toLowerCase())
      || (a == b);
}

function getPathParams(requested, expected){
  var pathParams = {};
  var requestArr = requested.split("/");
  var expectedArr = expected.split("/");
  for(let i=0; i<requestArr.length; i++){
    var r = requestArr[i];
    var e = expectedArr[i];
    if(isVariable(e)){
      pathParams[e.substring(1)] = r;
    }
  }
  return pathParams;
}

function isVariable(string){
  return string.startsWith(":");
}

module.exports = Router
