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
    routeTimes.reverse();
    response += buildResponse(routeTimes.pop());
    response += buildResponse(routeTimes.pop());
    response += buildBriefResponse(routeTimes);

    this.response.tell(response);
}

function buildResponse(routeTime) {
    var route = sanitizeRoute(routeTime[0]);
    var routeTime = sanitizeRoute(routeTime[1]);
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

function buildBriefResponse(routeTimes) {
    var response = "There's also ";
    while (routeTimes.length) {
        var routeTime = routeTimes.pop();
        var route = sanitizeRoute(routeTime[0]);
        var time = routeTime[1];
        if (routeTimes.length == 0) // last one, grammar is important
            response += "and "
        response += "a " + route +" in " + time + " "; 
        response += (time == "NOW") ? "mother fucker, " : 
                    (time == 1) ?  "minute, " : "minutes, ";
    }
    return response;
}

function sanitizeRoute(route) {
    if (route.slice(-1) == "E")
        route = route.slice(0,-1) + " express";
    return route;
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
