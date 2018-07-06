let fs = require("fs");
let Matcher = require("./MatcherFunctions");
let Util = require("./UtilFunctions")

function handleSimple(req, res, route){
  res.write(JSON.stringify(route.callback(Util.getPathParams(req.url, route.path))));
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
  var actualFile = getFile(fileLocation);
    if(actualFile){
      let file = fs.readFileSync(actualFile);
      res.write(file);
      return true;
    }
}

function getFile(fileLocation){
  if(fs.existsSync(fileLocation)){
    if(fs.lstatSync(fileLocation).isDirectory()){
      if(fs.existsSync(fileLocation + "index.html")){
        return fileLocation + "index.html";
      }
    }else{
        return fileLocation;
    }
  }
}

module.exports = { handleSimple, handlePage, handleFolder }
