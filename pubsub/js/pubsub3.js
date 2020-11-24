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


 var sess003;
var windowUrl;
var isReconnect = false;

var _idchars = "0123456789";
var _idlen = 6;
var _idpat = /^\d*$/;


function randomChannelId003() {
   var id = "";
   for (var i = 0; i < _idlen; i += 1) {
      id += _idchars.charAt(Math.floor(Math.random() * _idchars.length));
   }
   return id;
};

function checkChannelId003(id) {
   return id != null && id != "" && id.length == _idlen && _idpat.test(id);
}

function isValueChar003(e) {

   var kc = e.keyCode;
   if ((kc > 8 && kc < 46 && kc !== 32) || (kc > 90 && kc < 94) || (kc > 111 && kc < 186) ) {
      return false;
   } else {
      return true;
   }
}

var controllerChannelId003;
var controllerChannel003 = null;
var controllerChannelSwitch003 = null;
var controllerChannelCancel003 = null;


function switchChannel003(newChannelId) {

   onChannelSwitch003(controllerChannelId003, newChannelId);

   controllerChannelId003 = newChannelId;
   controllerChannel003.disabled = false;
   controllerChannelSwitch003.disabled = true;
   controllerChannelCancel003.disabled = true;
   controllerChannel003.value = controllerChannelId003;
}


function updateStatusline003(statusline003) {
   $(".statusline003").html(statusline003);
};

var connection003 = null;
function connect003() {

   // the WAMP connection003 to the Router
   //
   var connection003 = new autobahn.Connection({
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


   connection003.onopen = function (session, details) {

      sess003 = session;

      controllerChannelId003 = null;

      setupDemo003();

      if (details.x_cb_node_id) {
         updateStatusline003("Connected to node <strong>" + details.x_cb_node_id + "</strong> at " + wsuri);
      } else {
         updateStatusline003("Connected to " + wsuri);
      }

      // establish prefix to use for shorter URL notation
      // sess003.prefix("api", channelBaseUri);

      if (checkChannelId003(controllerChannel003.value)) {
         switchChannel003(controllerChannel003.value);
      } else {
         switchChannel003(randomChannelId003());
      }

      if(typeof(afterAuth) !== "undefined" ) {
         afterAuth(); // only exists in colorpicker demo
      }
   };

   connection003.onclose = function(reason, details) {
      sess003 = null;
      console.log("connection003 closed ", reason, details);
   
      if (details.will_retry) {
         updateStatusline003("Trying to reconnect in " + parseInt(details.retry_delay) + " s.");
      } else {
         updateStatusline003("Disconnected");   
      }
   }

   connection003.open();
}

var setupInfoDictionary = {};

$(document).ready(function()
{
   updateStatusline003("Not connected.");

   controllerChannelSwitch003 = document.getElementById('controller-channel-switch003');
   controllerChannelCancel003 = document.getElementById('controller-channel-cancel003');
   controllerChannel003 = document.getElementById('controller-channel003');

   // select the current channel string on focus
   controllerChannel003.onmouseup = function() { return false; };
   controllerChannel003.onfocus = function(evt) {
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
      controllerChannel003.value = setupInfoDictionary.channel;
   }

   controllerChannel003.onkeyup = function (e) {

      if (controllerChannel003.value != controllerChannelId003) {

         controllerChannelCancel003.disabled = false;

         if (controllerChannel003.value.length == _idlen && _idpat.test(controllerChannel003.value)) {
            controllerChannelSwitch003.disabled = false;
         } else {
            controllerChannelSwitch003.disabled = true;
         }
      } else {
         controllerChannelCancel003.disabled = true;
         controllerChannelSwitch003.disabled = true;
      }
   };

   controllerChannelCancel003.onclick = function () {
      controllerChannel003.value = controllerChannelId003;
      controllerChannelSwitch003.disabled = true;
      controllerChannelCancel003.disabled = true;
   }

   controllerChannelSwitch003.onclick = function () {

      switchChannel003(controllerChannel003.value);
      controllerChannelSwitch003.disabled = true;
      controllerChannelCancel003.disabled = true;
   }

   // setupDemo003();

   connect003();

});

var sendTime003 = null,
    recvTime003 = null,

    receivedMessages003 = null,
    receivedMessagesClear003 = null,

    // curlLine = null,

    pubTopic003 = null,
    pubMessage003 = null,
    pubMessageBtn003 = null,

    currentSubscription003 = null;

// Note: REST bridge functionality has not yet been implemented for
//       the new version of Crossbar.io, and all related functionality
//       has been disabled for now.

// function updateCurl() {
//    var cbody = $("#pub_message").val();
//    curlLine.value = "curl -d 'topic=" + channelBaseUri + "." + $("#pub_topic").val() + "&event=\"" + cbody + "\"' " + hubRestApi;
// }


function setupDemo003() {

   sess003.prefix("api", demoPrefix + ".pubsub");

   receivedMessages003 = document.getElementById('sub_message003');
   receivedMessages003.value = "";
   receivedMessages003.disabled = true;

   receivedMessagesClear003 = document.getElementById('sub_message_clear003');
   receivedMessagesClear003.disabled = true;

   receivedMessagesClear003.onclick = function () {
      receivedMessages003.value = "";
      receivedMessages003.scrollTop = receivedMessages003.scrollHeight;
      receivedMessagesClear003.disabled = true;
   }

   // select the current channel string on focus
   var publishChannel003 = document.getElementById("pub_topic003");
   publishChannel003.onmouseup = function() { return false; };
   publishChannel003.onfocus = function(evt) {
         evt.target.select();
   };

   // curlLine = document.getElementById('pub_curl');
   // curlLine.readOnly = true;

   pubTopic003 = document.getElementById('pub_topic003');
   pubMessage003 = document.getElementById('pub_message003');

   $("#pub_message003").val("Hello, world.");

   pubMessageBtn003 = document.getElementById('pub_publish003');

   pubMessageBtn003.onclick = function () {

      if ('performance003' in window && 'now' in performance003) {
         sendTime003 = performance003.now();         
      } else {
         sendTime003 = (new Date).getTime();         
      }

      sess003.publish("api:" + $("#pub_topic003").val(), [$("#pub_message003").val()], {}, {acknowledge: true, exclude_me: false}).then(
         function(publication) {
            console.log("published003", publication);

         },
         function(error) {
            console.log("publication error", error);
         }
      );
   }
   pubMessageBtn003.disabled = false;


   // using jQuery because IE8 handles .onkeyup differently
   $(pubTopic003).keyup(function(e) {

      if (isValueChar003(e)) {
         if (checkChannelId003(pubTopic003.value)) {
            // updateCurl();
            $("#pub_topic_full003").text(sess003.resolve("api:" + pubTopic003.value));
            pubMessageBtn003.disabled = false;
         } else {
            pubMessageBtn003.disabled = true;
         }
      }
   });

   $(pubMessage003).keyup(function(e) {

      if (isValueChar003(e)) {
         // updateCurl();
      }
   });

   // $("#helpButton1").click(function() { $(".info_bar1").toggle() });

}


function onMessage003(args, kwargs, details) {
   var event = args[0];
   console.log("event received", details);

   if (sendTime003) {
       if ('performance003' in window && 'now' in performance003) {
         recvTime003 = performance003.now();  
       } else {
         recvTime003 = (new Date).getTime();         
       }
      var diff = recvTime003 - sendTime003;
      diff = Math.round(diff * 10)/10;
      $("#sub_message_details_time003").text(diff + " ms / " + event.length + " bytes");
      sendTime003 = null;
   } else {
      $("#sub_message_details_time003").text(" - / " + event.length + " bytes");
   }

   receivedMessages003.value += event + "\r\n";
   receivedMessages003.scrollTop = receivedMessages003.scrollHeight;

   receivedMessagesClear003.disabled = false;
}


function onChannelSwitch003(oldChannelId, newChannelId) {
   console.log("onChannelSwitch003", oldChannelId, newChannelId);

   if (oldChannelId) {

      currentSubscription003.unsubscribe();

   } else {
      console.log("initial setup");

      // initial setup
      $("#pub_topic003").val(newChannelId);
      $("#pub_topic_full003").text(sess003.resolve("api:" + newChannelId));
      // updateCurl();
   }

   sess003.subscribe("api:" + newChannelId, onMessage003).then(
      function(subscription) {
         console.log("subscribed", subscription, newChannelId);
         currentSubscription003 = subscription;
      },
      function(error) {
         console.log("subscription error", error);
      }
   );
   console.log("post subscribe");

   $('#new-window').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#secondInstance').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#pubsub_new_window_link').html(window.location.protocol + "//" + window.location.host + window.location.pathname + '?channel=' + newChannelId);
   $("#sub_topic_full003").text(sess003.resolve("api:" + newChannelId));
}

// var testreceive = function(args, kwargs, details) {
//    console.log("testreceive", args, kwargs, details);
// }

