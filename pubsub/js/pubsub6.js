/******************************************************************************
 *
 *  Copyright 2012-2013 Tavendo GmbH.
 *
 *  Licensed under the Apache 2.0 license
 *  http://www.apache.org/licenses/LICENSE-2.0.html
 *
 ******************************************************************************/

"use strict";

var demoRealm = "realm1";
var demoPrefix = "io.crossbar.demo";

// the URL of the WAMP Router (Crossbar.io)
//
var wsuri;
if (document.location.origin == "file://") {
   // wsuri = "ws://127.0.0.1:8080";
   wsuri = "ws://localhost:8080/ws";

} else {
   wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
               document.location.host + "/ws";
}

var httpUri;

if (document.location.origin == "file://") {
   // httpUri = "http://127.0.0.1:8080/lp";
   httpUri = "ws://localhost:8080/ws";

} else {
   httpUri = (document.location.protocol === "http:" ? "http:" : "https:") + "//" +
               document.location.host + "/lp";
}


 var sess006;
var windowUrl;
var isReconnect = false;

var _idchars = "0123456789";
var _idlen = 6;
var _idpat = /^\d*$/;


function randomChannelId006() {
   var id = "";
   for (var i = 0; i < _idlen; i += 1) {
      id += _idchars.charAt(Math.floor(Math.random() * _idchars.length));
   }
   // return id;
   return 404890;
};

function checkChannelId006(id) {
   return id != null && id != "" && id.length == _idlen && _idpat.test(id);
}

function isValueChar006(e) {

   var kc = e.keyCode;
   if ((kc > 8 && kc < 46 && kc !== 32) || (kc > 90 && kc < 94) || (kc > 111 && kc < 186) ) {
      return false;
   } else {
      return true;
   }
}

var controllerChannelId006;
var controllerChannel006 = null;
var controllerChannelSwitch006 = null;
var controllerChannelCancel006 = null;


function switchChannel006(newChannelId) {

   onChannelSwitch006(controllerChannelId006, newChannelId);

   controllerChannelId006 = newChannelId;
   controllerChannel006.disabled = false;
   controllerChannelSwitch006.disabled = true;
   controllerChannelCancel006.disabled = true;
   controllerChannel006.value = controllerChannelId006;
}


function updateStatusline006(statusline006) {
   $(".statusline006").html(statusline006);
};

var connection006 = null;
function connect006() {

   // the WAMP connection006 to the Router
   //
   var connection006 = new autobahn.Connection({
      // url: wsuri,
      transports: [
         {
            'type': 'websocket',
            'url': wsuri
         },
         {
            'type': 'longpoll',
            'url': httpUri
         }
      ],
      realm: "realm1"
   });


   connection006.onopen = function (session, details) {

      sess006 = session;

      controllerChannelId006 = null;

      setupDemo006();

      if (details.x_cb_node_id) {
         updateStatusline006("Connected to node <strong>" + details.x_cb_node_id + "</strong> at " + wsuri);
      } else {
         updateStatusline006("Connected to " + wsuri);
      }

      // establish prefix to use for shorter URL notation
      // sess006.prefix("api", channelBaseUri);

      if (checkChannelId006(controllerChannel006.value)) {
         switchChannel006(controllerChannel006.value);
      } else {
         switchChannel006(randomChannelId006());
      }

      if(typeof(afterAuth) !== "undefined" ) {
         afterAuth(); // only exists in colorpicker demo
      }
   };

   connection006.onclose = function(reason, details) {
      sess006 = null;
      console.log("connection006 closed ", reason, details);
   
      if (details.will_retry) {
         updateStatusline006("Trying to reconnect in " + parseInt(details.retry_delay) + " s.");
      } else {
         updateStatusline006("Disconnected");   
      }
   }

   connection006.open();
}

var setupInfoDictionary = {};

$(document).ready(function()
{
   updateStatusline006("Not connected.");

   controllerChannelSwitch006 = document.getElementById('controller-channel-switch006');
   controllerChannelCancel006 = document.getElementById('controller-channel-cancel006');
   controllerChannel006 = document.getElementById('controller-channel006');

   // select the current channel string on focus
   controllerChannel006.onmouseup = function() { return false; };
   controllerChannel006.onfocus = function(evt) {
         evt.target.select();
   };

   // check for additional demo setup data in the URL
   windowUrl = document.URL; // string

   // check if '?' fragment is present
   // then make dictionary of values here
   if (windowUrl.indexOf('?') !== -1) {
      var setupInfoRaw = windowUrl.split('?')[1];
      var setupInfoSeparated = setupInfoRaw.split('&');

      for (var i = 0; i < setupInfoSeparated.length; i++) {
         var pair = setupInfoSeparated[i].split('=');
         var key = pair[0];
         var value = pair[1];
         setupInfoDictionary[key] = value;
      }

   }
   if ("channel" in setupInfoDictionary) {
      controllerChannel006.value = setupInfoDictionary.channel;
   }

   controllerChannel006.onkeyup = function (e) {

      if (controllerChannel006.value != controllerChannelId006) {

         controllerChannelCancel006.disabled = false;

         if (controllerChannel006.value.length == _idlen && _idpat.test(controllerChannel006.value)) {
            controllerChannelSwitch006.disabled = false;
         } else {
            controllerChannelSwitch006.disabled = true;
         }
      } else {
         controllerChannelCancel006.disabled = true;
         controllerChannelSwitch006.disabled = true;
      }
   };

   controllerChannelCancel006.onclick = function () {
      controllerChannel006.value = controllerChannelId006;
      controllerChannelSwitch006.disabled = true;
      controllerChannelCancel006.disabled = true;
   }

   controllerChannelSwitch006.onclick = function () {

      switchChannel006(controllerChannel006.value);
      controllerChannelSwitch006.disabled = true;
      controllerChannelCancel006.disabled = true;
   }

   // setupDemo006();

   connect006();

});

var sendTime006 = null,
    recvTime006 = null,

    receivedMessages006 = null,
    receivedMessagesClear006 = null,

    // curlLine = null,

    pubTopic006 = null,
    pubMessage006 = null,
    pubMessageBtn006 = null,

    currentSubscription006 = null;

// Note: REST bridge functionality has not yet been implemented for
//       the new version of Crossbar.io, and all related functionality
//       has been disabled for now.

// function updateCurl() {
//    var cbody = $("#pub_message").val();
//    curlLine.value = "curl -d 'topic=" + channelBaseUri + "." + $("#pub_topic").val() + "&event=\"" + cbody + "\"' " + hubRestApi;
// }


function setupDemo006() {

   sess006.prefix("api", demoPrefix + ".pubsub");

   receivedMessages006 = document.getElementById('sub_message006');
   receivedMessages006.value = "";
   receivedMessages006.disabled = true;

   receivedMessagesClear006 = document.getElementById('sub_message_clear006');
   receivedMessagesClear006.disabled = true;

   receivedMessagesClear006.onclick = function () {
      receivedMessages006.value = "";
      receivedMessages006.scrollTop = receivedMessages006.scrollHeight;
      receivedMessagesClear006.disabled = true;
   }

   // select the current channel string on focus
   var publishChannel006 = document.getElementById("pub_topic006");
   publishChannel006.onmouseup = function() { return false; };
   publishChannel006.onfocus = function(evt) {
         evt.target.select();
   };

   // curlLine = document.getElementById('pub_curl');
   // curlLine.readOnly = true;

   pubTopic006 = document.getElementById('pub_topic006');
   pubMessage006 = document.getElementById('pub_message006');

   let mess = JSON.stringify({
      connectionStatus: "READY_TO_CONNECT",
      engineStatus: "90%",
      msg: "Camera 3",
      deviceId: "000007",
      deviceName: "Window 3",
      tags: "Camera 3",
      sensorType: "2",
      locationType: "3",
      deviceGroup: "Camera",
    });
   $("#pub_message006").val(mess);

   pubMessageBtn006 = document.getElementById('pub_publish006');

   pubMessageBtn006.onclick = function () {

      if ('performance006' in window && 'now' in performance006) {
         sendTime006 = performance006.now();         
      } else {
         sendTime006 = (new Date).getTime();         
      }

      sess006.publish("api:" + $("#pub_topic006").val(), [$("#pub_message006").val()], {}, {acknowledge: true, exclude_me: false}).then(
         function(publication) {
            console.log("published006", publication);

         },
         function(error) {
            console.log("publication error", error);
         }
      );
   }
   pubMessageBtn006.disabled = false;


   // using jQuery because IE8 handles .onkeyup differently
   $(pubTopic006).keyup(function(e) {

      if (isValueChar006(e)) {
         if (checkChannelId006(pubTopic006.value)) {
            // updateCurl();
            $("#pub_topic_full006").text(sess006.resolve("api:" + pubTopic006.value));
            pubMessageBtn006.disabled = false;
         } else {
            pubMessageBtn006.disabled = true;
         }
      }
   });

   $(pubMessage006).keyup(function(e) {

      if (isValueChar006(e)) {
         // updateCurl();
      }
   });

   // $("#helpButton1").click(function() { $(".info_bar1").toggle() });

}


function onMessage006(args, kwargs, details) {
   var event = args[0];
   console.log("event received", details);

   if (sendTime006) {
       if ('performance006' in window && 'now' in performance006) {
         recvTime006 = performance006.now();  
       } else {
         recvTime006 = (new Date).getTime();         
       }
      var diff = recvTime006 - sendTime006;
      diff = Math.round(diff * 10)/10;
      $("#sub_message_details_time006").text(diff + " ms / " + event.length + " bytes");
      sendTime006 = null;
   } else {
      $("#sub_message_details_time006").text(" - / " + event.length + " bytes");
   }

   receivedMessages006.value += event + "\r\n";
   receivedMessages006.scrollTop = receivedMessages006.scrollHeight;

   receivedMessagesClear006.disabled = false;
}


function onChannelSwitch006(oldChannelId, newChannelId) {
   console.log("onChannelSwitch006", oldChannelId, newChannelId);

   if (oldChannelId) {

      currentSubscription006.unsubscribe();

   } else {
      console.log("initial setup");

      // initial setup
      $("#pub_topic006").val(newChannelId);
      $("#pub_topic_full006").text(sess006.resolve("api:" + newChannelId));
      // updateCurl();
   }

   sess006.subscribe("api:" + newChannelId, onMessage006).then(
      function(subscription) {
         console.log("subscribed", subscription, newChannelId);
         currentSubscription006 = subscription;
      },
      function(error) {
         console.log("subscription error", error);
      }
   );
   console.log("post subscribe");

   $('#new-window').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#secondInstance').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#pubsub_new_window_link').html(window.location.protocol + "//" + window.location.host + window.location.pathname + '?channel=' + newChannelId);
   $("#sub_topic_full006").text(sess006.resolve("api:" + newChannelId));
}

// var testreceive = function(args, kwargs, details) {
//    console.log("testreceive", args, kwargs, details);
// }

