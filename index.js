// Alexa SDK for JavaScript v1.0.00
// Copyright (c) 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved. Use is subject to license terms.

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill'),
    RouteArrival = require('./RouteArrival');


/**
 * OneBusAway is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var OneBusAway = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
OneBusAway.prototype = Object.create(AlexaSkill.prototype);
OneBusAway.prototype.constructor = OneBusAway;

OneBusAway.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("OneBusAway onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

OneBusAway.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("OneBusAway onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Ask me about buses. And stuff";
    response.ask(speechOutput);
};

OneBusAway.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("OneBusAway onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

OneBusAway.prototype.intentHandlers = {

    // register custom intent handlers
    OneBusAwayIntent: function (intent, session, response) {
        var arrival = new RouteArrival(response); // TODO: Cound get route information and inject it here
        arrival.requestResponse();
    }

};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the OneBusAway skill.
    var busService = new OneBusAway();
    busService.execute(event, context);
};

