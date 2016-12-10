'use strict'

var DEBUG = true;

function log(msg)  {
    if (DEBUG) {
        console.log(msg);
    }
}

var cheerio = require("cheerio"),
    request = require("request");


// TODO: pass in id, and route id for more generic handling
function RouteArrival(response) {
    this.url = "http://pugetsound.onebusaway.org/where/standard/stop.action?id=1_6050"
    this.response = response;
}

/**
 * Bootstrap 
 */
RouteArrival.prototype.requestResponse = function () {

    var routeArrival = this;


    request(this.url, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var times = parseRoutesAndTimes($);
        routeArrival.send(times);
      }
    });
}

RouteArrival.prototype.send = function(routeTimes) {
    var response = "";
    for (var i = 0; i < routeTimes.length; i++) {
        response += buildResponse(routeTimes[i]);
    }

    this.response.tell(response);
}

function buildResponse(routeTime) {
    var route = routeTime[0];
    var routeTime = routeTime[1];
    log("Route: "+route);
    log("time:" + routeTime);
    var response = "The next "+ route +" comes in " + routeTime + " "; 
    response += (routeTime == "NOW") ? "mother fucker" : 
                (routeTime == 1) ?  "minute" : "minutes";

    if (routeTime < 4 && routeTime >= 0) {
        response += ", you better run bitch"; 
    } else if (routeTime < 0) {
        response += ", so, invent time travel, or sit the fuck down for a minute";
    }
    response +=". ";
    return response;
} 

function parseRoutesAndTimes($) {
    var arrayOfRoutes = $('.arrivalsRow').find('.arrivalsRouteEntry').find('a').map(function(i, val) {
        return $(val).text();
    });
    var arrayOfTimes = $('.arrivalsRow').find('.arrivalsStatusEntry').find('span').map(function(i, val) {
        return $(val).text();
    });
    var result = []
    for (var i = 0; i< arrayOfRoutes.length - 1; i++) {
        result.push([arrayOfRoutes[i], arrayOfTimes[i]]);
    }
    return result;
}

module.exports = RouteArrival;
