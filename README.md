# AR-Router

Simple url router, to create API endpoints and server files and static folders, made in Node.JS.

I created this to learn the basics of Node, it is not built to be used in production code.

## Usage

### Initilise

Install package

```
npm i ar-router
```

Then create Router

```javascript
let arRouter = require("ar-router");
let router = new arRouter.Router();
``` 

### Handle

```javascript
http.createServer(function(req, res){
	router.handle(req, res);
}).listen(8080);
```

### Simple API 

```javascript
router.register({

	path: "/api/something",
	callback: function(routeParams){
		return "This will get returned as JSON";
	},

});
```

### API Router Params

```javascript
router.register({

	path: "/api/something/:name",
	callback: function(routeParams){
		console.log(routeParams);
		return "Hello " + routeParams.name;
	}

});
```

### Register Page

```javascript
// Serve homePage.html at /home
router.registerPage("/home", "homePage.html");
```

### Register Folder

```javascript
// Serve contents of /resources/** folder at /res/**
router.registerStaticFolder("/res", "resources");
```

### Additional API Route Configuration

```javascript
router.register({

	requestMethod: arRouter.RequestMethod.POST, // This defaults to GET (can also use "GET")
	path: "/api/something/:name",
	callback: function(routeParams){
		console.log(routeParams);
		return "Hello " + routeParams.name;
	},
	caseInsensitive: false // This defaults to true

});
```
