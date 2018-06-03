// handled different type of requests: GET, POST , etc
// return json objects (REST-Y)
// return static files (disallow directory traversal)
  // router.addStaticFolder(folderLocation, <optional> mappedUrlPrefix)
// dynamic routes with variables /series/:number/whatevs
  // give them back to the dev to use
//

function Router(options){
  this.routes = [];
}

Router.prototype.register = function(requestMethod, path, callback){
  this.routes.push({
    requestMethod : requestMethod,
    path: path,
    callback: callback
  })
}

Router.prototype.handle = function(req, res){
  var method = req.method;
  var url = req.url;
  var routeExists = false;
  for(route of this.routes){
    if(route.requestMethod == method && route.path == url){
      routeExists = true;
      res.write(JSON.stringify(route.callback()))
    }
  }
  if(!routeExists){
    res.write("404");
  }

  res.end();
}

Router.RequestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  ANY: "ANY"
}

module.exports = Router
