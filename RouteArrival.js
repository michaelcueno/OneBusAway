'use strict'

var DEBUG = false;

function log(msg)  {
    if (DEBUG) {
        console.log(msg);
    }
}

var cheerio = require("cheerio"),
    request = require("request");


// TODO: pass in id, and route id for more generic handling
function RouteArrival(response) {
    this.fortyURL = "http://pugetsound.onebusaway.org/where/standard/stop.action?id=1_19360&route=1_102574";
    this.response = response;
}

/**
 * Bootstrap 
 */
RouteArrival.prototype.requestResponse = function () {

    var routeArrival = this;


    request(this.fortyURL, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var times = parseOutTimes($);
        routeArrival.send(times);
      }
    });
}

RouteArrival.prototype.send = function(times) {
    var firstTime = times[0];
    var introduction = "The next 40 comes in " + firstTime + " "; 
    introduction += (firstTime == "NOW") ? "mother fucker" : 
                    (firstTime == 1) ?  "minute" : "minutes";

    if (times[0] < 4 && times[0] >= 0) {
        introduction += ", you better run bitch"; 
    } else if (times[0] < 0) {
        introduction += ", so, invent time travel, or sit the fuck down for a minute";
    }

    if (times[1]) {
        introduction += ". There's also one in " + times[1] + " minutes";
    }

    this.response.tell(introduction);
}

function parseOutTimes($) {
    var arrayOfTimes = $('.arrivalsRow').find('.arrivalsStatusEntry').find('span').map(function( i, val) {
        return $(val).text();
    });
    return arrayOfTimes;
}

module.exports = RouteArrival;
