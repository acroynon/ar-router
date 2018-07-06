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

module.exports = { getPathParams, isVariable }
