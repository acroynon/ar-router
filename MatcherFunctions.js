let RouteType = require("./RouteType");
let Util = require("./UtilFunctions");

function routeMatches(req, route){
  return (
    route.requestMethod == req.method &&
    pathEquals(req.url, route)
  );
}

function pathEquals(requested, route){
  if(requested == route.path){ return true; }
  var requestArr = requested.split("/");
  var expectedArr = route.path.split("/");
  if(requestArr.length != expectedArr.length && route.type == RouteType.SIMPLE){
      return false;
  }
  for(let i=0; i<expectedArr.length; i++){
    var r = requestArr[i];
    var e = expectedArr[i];
    if(!((route.type == RouteType.SIMPLE && Util.isVariable(e)) || stringEquals(r, e, route.caseInsensitive))){
      return false;
    }
  }
  return true
}

function stringEquals(a, b, caseInsensitive){
  return (caseInsensitive && a.toLowerCase() == b.toLowerCase())
      || (a == b);
}

module.exports = { routeMatches, pathEquals, stringEquals }
