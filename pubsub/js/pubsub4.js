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
   // wsuri = "ws://127.0.0.1:8090";
   wsuri = "ws://localhost:8090/ws";

} else {
   wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
               document.location.host + "/ws";
}

var httpUri;

if (document.location.origin == "file://") {
   // httpUri = "http://127.0.0.1:8090/lp";
   httpUri = "ws://localhost:8090/ws";

} else {
   httpUri = (document.location.protocol === "http:" ? "http:" : "https:") + "//" +
               document.location.host + "/lp";
}


 var sess004;
var windowUrl;
var isReconnect = false;

var _idchars = "0123456789";
var _idlen = 6;
var _idpat = /^\d*$/;


function randomChannelId004() {
   var id = "";
   for (var i = 0; i < _idlen; i += 1) {
      id += _idchars.charAt(Math.floor(Math.random() * _idchars.length));
   }
   // return id;
   return 404890;
};

function checkChannelId004(id) {
   return id != null && id != "" && id.length == _idlen && _idpat.test(id);
}

function isValueChar004(e) {

   var kc = e.keyCode;
   if ((kc > 8 && kc < 46 && kc !== 32) || (kc > 90 && kc < 94) || (kc > 111 && kc < 186) ) {
      return false;
   } else {
      return true;
   }
}

var controllerChannelId004;
var controllerChannel004 = null;
var controllerChannelSwitch004 = null;
var controllerChannelCancel004 = null;


function switchChannel004(newChannelId) {

   onChannelSwitch004(controllerChannelId004, newChannelId);

   controllerChannelId004 = newChannelId;
   controllerChannel004.disabled = false;
   controllerChannelSwitch004.disabled = true;
   controllerChannelCancel004.disabled = true;
   controllerChannel004.value = controllerChannelId004;
}


function updateStatusline004(statusline004) {
   $(".statusline004").html(statusline004);
};

var connection004 = null;
function connect004() {

   // the WAMP connection004 to the Router
   //
   var connection004 = new autobahn.Connection({
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


   connection004.onopen = function (session, details) {

      sess004 = session;

      controllerChannelId004 = null;

      setupDemo004();

      if (details.x_cb_node_id) {
         updateStatusline004("Connected to node <strong>" + details.x_cb_node_id + "</strong> at " + wsuri);
      } else {
         updateStatusline004("Connected to " + wsuri);
      }

      // establish prefix to use for shorter URL notation
      // sess004.prefix("api", channelBaseUri);

      if (checkChannelId004(controllerChannel004.value)) {
         switchChannel004(controllerChannel004.value);
      } else {
         switchChannel004(randomChannelId004());
      }

      if(typeof(afterAuth) !== "undefined" ) {
         afterAuth(); // only exists in colorpicker demo
      }
   };

   connection004.onclose = function(reason, details) {
      sess004 = null;
      console.log("connection004 closed ", reason, details);
   
      if (details.will_retry) {
         updateStatusline004("Trying to reconnect in " + parseInt(details.retry_delay) + " s.");
      } else {
         updateStatusline004("Disconnected");   
      }
   }

   connection004.open();
}

var setupInfoDictionary = {};

$(document).ready(function()
{
   updateStatusline004("Not connected.");

   controllerChannelSwitch004 = document.getElementById('controller-channel-switch004');
   controllerChannelCancel004 = document.getElementById('controller-channel-cancel004');
   controllerChannel004 = document.getElementById('controller-channel004');

   // select the current channel string on focus
   controllerChannel004.onmouseup = function() { return false; };
   controllerChannel004.onfocus = function(evt) {
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
      controllerChannel004.value = setupInfoDictionary.channel;
   }

   controllerChannel004.onkeyup = function (e) {

      if (controllerChannel004.value != controllerChannelId004) {

         controllerChannelCancel004.disabled = false;

         if (controllerChannel004.value.length == _idlen && _idpat.test(controllerChannel004.value)) {
            controllerChannelSwitch004.disabled = false;
         } else {
            controllerChannelSwitch004.disabled = true;
         }
      } else {
         controllerChannelCancel004.disabled = true;
         controllerChannelSwitch004.disabled = true;
      }
   };

   controllerChannelCancel004.onclick = function () {
      controllerChannel004.value = controllerChannelId004;
      controllerChannelSwitch004.disabled = true;
      controllerChannelCancel004.disabled = true;
   }

   controllerChannelSwitch004.onclick = function () {

      switchChannel004(controllerChannel004.value);
      controllerChannelSwitch004.disabled = true;
      controllerChannelCancel004.disabled = true;
   }

   // setupDemo004();

   connect004();

});

var sendTime004 = null,
    recvTime004 = null,

    receivedMessages004 = null,
    receivedMessagesClear004 = null,

    // curlLine = null,

    pubTopic004 = null,
    pubMessage004 = null,
    pubMessageBtn004 = null,

    currentSubscription004 = null;

// Note: REST bridge functionality has not yet been implemented for
//       the new version of Crossbar.io, and all related functionality
//       has been disabled for now.

// function updateCurl() {
//    var cbody = $("#pub_message").val();
//    curlLine.value = "curl -d 'topic=" + channelBaseUri + "." + $("#pub_topic").val() + "&event=\"" + cbody + "\"' " + hubRestApi;
// }


function setupDemo004() {

   sess004.prefix("api", demoPrefix + ".pubsub");

   receivedMessages004 = document.getElementById('sub_message004');
   receivedMessages004.value = "";
   receivedMessages004.disabled = true;

   receivedMessagesClear004 = document.getElementById('sub_message_clear004');
   receivedMessagesClear004.disabled = true;

   receivedMessagesClear004.onclick = function () {
      receivedMessages004.value = "";
      receivedMessages004.scrollTop = receivedMessages004.scrollHeight;
      receivedMessagesClear004.disabled = true;
   }

   // select the current channel string on focus
   var publishChannel004 = document.getElementById("pub_topic004");
   publishChannel004.onmouseup = function() { return false; };
   publishChannel004.onfocus = function(evt) {
         evt.target.select();
   };

   // curlLine = document.getElementById('pub_curl');
   // curlLine.readOnly = true;

   pubTopic004 = document.getElementById('pub_topic004');
   pubMessage004 = document.getElementById('pub_message004');

   let mess = JSON.stringify({
      connectionStatus: "READY_TO_CONNECT",
      engineStatus: "90%",
      msg: "Door Radar Sensor",
      deviceId: "000005",
      deviceName: "Door Radar Sensor",
      tags: "Door",
      sensorType: "1",
      locationType: "1",
      deviceGroup: "Radar Sensor",
    });
   $("#pub_message004").val(mess);

   pubMessageBtn004 = document.getElementById('pub_publish004');

   pubMessageBtn004.onclick = function () {

      if ('performance004' in window && 'now' in performance004) {
         sendTime004 = performance004.now();         
      } else {
         sendTime004 = (new Date).getTime();         
      }

      sess004.publish("api:" + $("#pub_topic004").val(), [$("#pub_message004").val()], {}, {acknowledge: true, exclude_me: false}).then(
         function(publication) {
            console.log("published004", publication);

         },
         function(error) {
            console.log("publication error", error);
         }
      );
   }
   pubMessageBtn004.disabled = false;


   // using jQuery because IE8 handles .onkeyup differently
   $(pubTopic004).keyup(function(e) {

      if (isValueChar004(e)) {
         if (checkChannelId004(pubTopic004.value)) {
            // updateCurl();
            $("#pub_topic_full004").text(sess004.resolve("api:" + pubTopic004.value));
            pubMessageBtn004.disabled = false;
         } else {
            pubMessageBtn004.disabled = true;
         }
      }
   });

   $(pubMessage004).keyup(function(e) {

      if (isValueChar004(e)) {
         // updateCurl();
      }
   });

   // $("#helpButton1").click(function() { $(".info_bar1").toggle() });

}


function onMessage004(args, kwargs, details) {
   var event = args[0];
   console.log("event received", details);

   if (sendTime004) {
       if ('performance004' in window && 'now' in performance004) {
         recvTime004 = performance004.now();  
       } else {
         recvTime004 = (new Date).getTime();         
       }
      var diff = recvTime004 - sendTime004;
      diff = Math.round(diff * 10)/10;
      $("#sub_message_details_time004").text(diff + " ms / " + event.length + " bytes");
      sendTime004 = null;
   } else {
      $("#sub_message_details_time004").text(" - / " + event.length + " bytes");
   }

   receivedMessages004.value += event + "\r\n";
   receivedMessages004.scrollTop = receivedMessages004.scrollHeight;

   receivedMessagesClear004.disabled = false;
}


function onChannelSwitch004(oldChannelId, newChannelId) {
   console.log("onChannelSwitch004", oldChannelId, newChannelId);

   if (oldChannelId) {

      currentSubscription004.unsubscribe();

   } else {
      console.log("initial setup");

      // initial setup
      $("#pub_topic004").val(newChannelId);
      $("#pub_topic_full004").text(sess004.resolve("api:" + newChannelId));
      // updateCurl();
   }

   sess004.subscribe("api:" + newChannelId, onMessage004).then(
      function(subscription) {
         console.log("subscribed", subscription, newChannelId);
         currentSubscription004 = subscription;
      },
      function(error) {
         console.log("subscription error", error);
      }
   );
   console.log("post subscribe");

   $('#new-window').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#secondInstance').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#pubsub_new_window_link').html(window.location.protocol + "//" + window.location.host + window.location.pathname + '?channel=' + newChannelId);
   $("#sub_topic_full004").text(sess004.resolve("api:" + newChannelId));
}

// var testreceive = function(args, kwargs, details) {
//    console.log("testreceive", args, kwargs, details);
// }

