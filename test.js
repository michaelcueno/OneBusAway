var handler = require("./index.js");var Route = require("./RouteArrival.js");

var mockResponse = {
  tell : function(text) {
    console.log(text);
  },
}

var routeTest = new Route(mockResponse); 

routeTest.requestResponse();

console.log('hey');
