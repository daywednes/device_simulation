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


 var sess005;
var windowUrl;
var isReconnect = false;

var _idchars = "0123456789";
var _idlen = 6;
var _idpat = /^\d*$/;


function randomChannelId005() {
   var id = "";
   for (var i = 0; i < _idlen; i += 1) {
      id += _idchars.charAt(Math.floor(Math.random() * _idchars.length));
   }
   // return id;
   return 404890;
};

function checkChannelId005(id) {
   return id != null && id != "" && id.length == _idlen && _idpat.test(id);
}

function isValueChar005(e) {

   var kc = e.keyCode;
   if ((kc > 8 && kc < 46 && kc !== 32) || (kc > 90 && kc < 94) || (kc > 111 && kc < 186) ) {
      return false;
   } else {
      return true;
   }
}

var controllerChannelId005;
var controllerChannel005 = null;
var controllerChannelSwitch005 = null;
var controllerChannelCancel005 = null;


function switchChannel005(newChannelId) {

   onChannelSwitch005(controllerChannelId005, newChannelId);

   controllerChannelId005 = newChannelId;
   controllerChannel005.disabled = false;
   controllerChannelSwitch005.disabled = true;
   controllerChannelCancel005.disabled = true;
   controllerChannel005.value = controllerChannelId005;
}


function updateStatusline005(statusline005) {
   $(".statusline005").html(statusline005);
};

var connection005 = null;
function connect005() {

   // the WAMP connection005 to the Router
   //
   var connection005 = new autobahn.Connection({
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


   connection005.onopen = function (session, details) {

      sess005 = session;

      controllerChannelId005 = null;

      setupDemo005();

      if (details.x_cb_node_id) {
         updateStatusline005("Connected to node <strong>" + details.x_cb_node_id + "</strong> at " + wsuri);
      } else {
         updateStatusline005("Connected to " + wsuri);
      }

      // establish prefix to use for shorter URL notation
      // sess005.prefix("api", channelBaseUri);

      if (checkChannelId005(controllerChannel005.value)) {
         switchChannel005(controllerChannel005.value);
      } else {
         switchChannel005(randomChannelId005());
      }

      if(typeof(afterAuth) !== "undefined" ) {
         afterAuth(); // only exists in colorpicker demo
      }
   };

   connection005.onclose = function(reason, details) {
      sess005 = null;
      console.log("connection005 closed ", reason, details);
   
      if (details.will_retry) {
         updateStatusline005("Trying to reconnect in " + parseInt(details.retry_delay) + " s.");
      } else {
         updateStatusline005("Disconnected");   
      }
   }

   connection005.open();
}

var setupInfoDictionary = {};

$(document).ready(function()
{
   updateStatusline005("Not connected.");

   controllerChannelSwitch005 = document.getElementById('controller-channel-switch005');
   controllerChannelCancel005 = document.getElementById('controller-channel-cancel005');
   controllerChannel005 = document.getElementById('controller-channel005');

   // select the current channel string on focus
   controllerChannel005.onmouseup = function() { return false; };
   controllerChannel005.onfocus = function(evt) {
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
      controllerChannel005.value = setupInfoDictionary.channel;
   }

   controllerChannel005.onkeyup = function (e) {

      if (controllerChannel005.value != controllerChannelId005) {

         controllerChannelCancel005.disabled = false;

         if (controllerChannel005.value.length == _idlen && _idpat.test(controllerChannel005.value)) {
            controllerChannelSwitch005.disabled = false;
         } else {
            controllerChannelSwitch005.disabled = true;
         }
      } else {
         controllerChannelCancel005.disabled = true;
         controllerChannelSwitch005.disabled = true;
      }
   };

   controllerChannelCancel005.onclick = function () {
      controllerChannel005.value = controllerChannelId005;
      controllerChannelSwitch005.disabled = true;
      controllerChannelCancel005.disabled = true;
   }

   controllerChannelSwitch005.onclick = function () {

      switchChannel005(controllerChannel005.value);
      controllerChannelSwitch005.disabled = true;
      controllerChannelCancel005.disabled = true;
   }

   // setupDemo005();

   connect005();

});

var sendTime005 = null,
    recvTime005 = null,

    receivedMessages005 = null,
    receivedMessagesClear005 = null,

    // curlLine = null,

    pubTopic005 = null,
    pubMessage005 = null,
    pubMessageBtn005 = null,

    currentSubscription005 = null;

// Note: REST bridge functionality has not yet been implemented for
//       the new version of Crossbar.io, and all related functionality
//       has been disabled for now.

// function updateCurl() {
//    var cbody = $("#pub_message").val();
//    curlLine.value = "curl -d 'topic=" + channelBaseUri + "." + $("#pub_topic").val() + "&event=\"" + cbody + "\"' " + hubRestApi;
// }


function setupDemo005() {

   sess005.prefix("api", demoPrefix + ".pubsub");

   receivedMessages005 = document.getElementById('sub_message005');
   receivedMessages005.value = "";
   receivedMessages005.disabled = true;

   receivedMessagesClear005 = document.getElementById('sub_message_clear005');
   receivedMessagesClear005.disabled = true;

   receivedMessagesClear005.onclick = function () {
      receivedMessages005.value = "";
      receivedMessages005.scrollTop = receivedMessages005.scrollHeight;
      receivedMessagesClear005.disabled = true;
   }

   // select the current channel string on focus
   var publishChannel005 = document.getElementById("pub_topic005");
   publishChannel005.onmouseup = function() { return false; };
   publishChannel005.onfocus = function(evt) {
         evt.target.select();
   };

   // curlLine = document.getElementById('pub_curl');
   // curlLine.readOnly = true;

   pubTopic005 = document.getElementById('pub_topic005');
   pubMessage005 = document.getElementById('pub_message005');

   let mess = JSON.stringify({
      connectionStatus: "READY_TO_CONNECT",
      engineStatus: "90%",
      msg: "Window",
      deviceId: "000006",
      deviceName: "Window",
      tags: "Window",
      sensorType: "1",
      locationType: "1",
      deviceGroup: "1",
    });
   $("#pub_message005").val(mess);

   pubMessageBtn005 = document.getElementById('pub_publish005');

   pubMessageBtn005.onclick = function () {

      if ('performance005' in window && 'now' in performance005) {
         sendTime005 = performance005.now();         
      } else {
         sendTime005 = (new Date).getTime();         
      }

      sess005.publish("api:" + $("#pub_topic005").val(), [$("#pub_message005").val()], {}, {acknowledge: true, exclude_me: false}).then(
         function(publication) {
            console.log("published005", publication);

         },
         function(error) {
            console.log("publication error", error);
         }
      );
   }
   pubMessageBtn005.disabled = false;


   // using jQuery because IE8 handles .onkeyup differently
   $(pubTopic005).keyup(function(e) {

      if (isValueChar005(e)) {
         if (checkChannelId005(pubTopic005.value)) {
            // updateCurl();
            $("#pub_topic_full005").text(sess005.resolve("api:" + pubTopic005.value));
            pubMessageBtn005.disabled = false;
         } else {
            pubMessageBtn005.disabled = true;
         }
      }
   });

   $(pubMessage005).keyup(function(e) {

      if (isValueChar005(e)) {
         // updateCurl();
      }
   });

   // $("#helpButton1").click(function() { $(".info_bar1").toggle() });

}


function onMessage005(args, kwargs, details) {
   var event = args[0];
   console.log("event received", details);

   if (sendTime005) {
       if ('performance005' in window && 'now' in performance005) {
         recvTime005 = performance005.now();  
       } else {
         recvTime005 = (new Date).getTime();         
       }
      var diff = recvTime005 - sendTime005;
      diff = Math.round(diff * 10)/10;
      $("#sub_message_details_time005").text(diff + " ms / " + event.length + " bytes");
      sendTime005 = null;
   } else {
      $("#sub_message_details_time005").text(" - / " + event.length + " bytes");
   }

   receivedMessages005.value += event + "\r\n";
   receivedMessages005.scrollTop = receivedMessages005.scrollHeight;

   receivedMessagesClear005.disabled = false;
}


function onChannelSwitch005(oldChannelId, newChannelId) {
   console.log("onChannelSwitch005", oldChannelId, newChannelId);

   if (oldChannelId) {

      currentSubscription005.unsubscribe();

   } else {
      console.log("initial setup");

      // initial setup
      $("#pub_topic005").val(newChannelId);
      $("#pub_topic_full005").text(sess005.resolve("api:" + newChannelId));
      // updateCurl();
   }

   sess005.subscribe("api:" + newChannelId, onMessage005).then(
      function(subscription) {
         console.log("subscribed", subscription, newChannelId);
         currentSubscription005 = subscription;
      },
      function(error) {
         console.log("subscription error", error);
      }
   );
   console.log("post subscribe");

   $('#new-window').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#secondInstance').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#pubsub_new_window_link').html(window.location.protocol + "//" + window.location.host + window.location.pathname + '?channel=' + newChannelId);
   $("#sub_topic_full005").text(sess005.resolve("api:" + newChannelId));
}

// var testreceive = function(args, kwargs, details) {
//    console.log("testreceive", args, kwargs, details);
// }

