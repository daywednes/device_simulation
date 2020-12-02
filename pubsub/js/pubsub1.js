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


 var sess001;
var windowUrl;
var isReconnect = false;

var _idchars = "0123456789";
var _idlen = 6;
var _idpat = /^\d*$/;


function randomChannelId001() {
   var id = "";
   for (var i = 0; i < _idlen; i += 1) {
      id += _idchars.charAt(Math.floor(Math.random() * _idchars.length));
   }
   // return id;
   return 404890;
};

function checkChannelId001(id) {
   return id != null && id != "" && id.length == _idlen && _idpat.test(id);
}

function isValueChar001(e) {

   var kc = e.keyCode;
   if ((kc > 8 && kc < 46 && kc !== 32) || (kc > 90 && kc < 94) || (kc > 111 && kc < 186) ) {
      return false;
   } else {
      return true;
   }
}

var controllerChannelId001;
var controllerChannel001 = null;
var controllerChannelSwitch001 = null;
var controllerChannelCancel001 = null;


function switchChannel001(newChannelId) {

   onChannelSwitch001(controllerChannelId001, newChannelId);

   controllerChannelId001 = newChannelId;
   controllerChannel001.disabled = false;
   controllerChannelSwitch001.disabled = true;
   controllerChannelCancel001.disabled = true;
   controllerChannel001.value = controllerChannelId001;
}


function updateStatusline001(statusline001) {
   $(".statusline001").html(statusline001);
};

var connection001 = null;
function connect001() {

   // the WAMP connection001 to the Router
   //
   var connection001 = new autobahn.Connection({
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


   connection001.onopen = function (session, details) {

      sess001 = session;

      controllerChannelId001 = null;

      setupDemo001();

      if (details.x_cb_node_id) {
         updateStatusline001("Connected to node <strong>" + details.x_cb_node_id + "</strong> at " + wsuri);
      } else {
         updateStatusline001("Connected to " + wsuri);
      }

      // establish prefix to use for shorter URL notation
      // sess001.prefix("api", channelBaseUri);

      if (checkChannelId001(controllerChannel001.value)) {
         switchChannel001(controllerChannel001.value);
      } else {
         switchChannel001(randomChannelId001());
      }

      if(typeof(afterAuth) !== "undefined" ) {
         afterAuth(); // only exists in colorpicker demo
      }
   };

   connection001.onclose = function(reason, details) {
      sess001 = null;
      console.log("connection001 closed ", reason, details);
   
      if (details.will_retry) {
         updateStatusline001("Trying to reconnect in " + parseInt(details.retry_delay) + " s.");
      } else {
         updateStatusline001("Disconnected");   
      }
   }

   connection001.open();
}

var setupInfoDictionary = {};

$(document).ready(function()
{
   updateStatusline001("Not connected.");

   controllerChannelSwitch001 = document.getElementById('controller-channel-switch001');
   controllerChannelCancel001 = document.getElementById('controller-channel-cancel001');
   controllerChannel001 = document.getElementById('controller-channel001');

   // select the current channel string on focus
   controllerChannel001.onmouseup = function() { return false; };
   controllerChannel001.onfocus = function(evt) {
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
      controllerChannel001.value = setupInfoDictionary.channel;
   }

   controllerChannel001.onkeyup = function (e) {

      if (controllerChannel001.value != controllerChannelId001) {

         controllerChannelCancel001.disabled = false;

         if (controllerChannel001.value.length == _idlen && _idpat.test(controllerChannel001.value)) {
            controllerChannelSwitch001.disabled = false;
         } else {
            controllerChannelSwitch001.disabled = true;
         }
      } else {
         controllerChannelCancel001.disabled = true;
         controllerChannelSwitch001.disabled = true;
      }
   };

   controllerChannelCancel001.onclick = function () {
      controllerChannel001.value = controllerChannelId001;
      controllerChannelSwitch001.disabled = true;
      controllerChannelCancel001.disabled = true;
   }

   controllerChannelSwitch001.onclick = function () {

      switchChannel001(controllerChannel001.value);
      controllerChannelSwitch001.disabled = true;
      controllerChannelCancel001.disabled = true;
   }

   // setupDemo001();

   connect001();

});

var sendTime001 = null,
    recvTime001 = null,

    receivedMessages001 = null,
    receivedMessagesClear001 = null,

    // curlLine = null,

    pubTopic001 = null,
    pubMessage001 = null,
    pubMessageBtn001 = null,

    currentSubscription001 = null;

// Note: REST bridge functionality has not yet been implemented for
//       the new version of Crossbar.io, and all related functionality
//       has been disabled for now.

// function updateCurl() {
//    var cbody = $("#pub_message").val();
//    curlLine.value = "curl -d 'topic=" + channelBaseUri + "." + $("#pub_topic").val() + "&event=\"" + cbody + "\"' " + hubRestApi;
// }


function setupDemo001() {

   sess001.prefix("api", demoPrefix + ".pubsub");

   receivedMessages001 = document.getElementById('sub_message001');
   receivedMessages001.value = "";
   receivedMessages001.disabled = true;

   receivedMessagesClear001 = document.getElementById('sub_message_clear001');
   receivedMessagesClear001.disabled = true;

   receivedMessagesClear001.onclick = function () {
      receivedMessages001.value = "";
      receivedMessages001.scrollTop = receivedMessages001.scrollHeight;
      receivedMessagesClear001.disabled = true;
   }

   // select the current channel string on focus
   var publishChannel001 = document.getElementById("pub_topic001");
   publishChannel001.onmouseup = function() { return false; };
   publishChannel001.onfocus = function(evt) {
         evt.target.select();
   };

   // curlLine = document.getElementById('pub_curl');
   // curlLine.readOnly = true;

   pubTopic001 = document.getElementById('pub_topic001');
   pubMessage001 = document.getElementById('pub_message001');

   let mess = JSON.stringify({
      connectionStatus: "READY_TO_CONNECT",
      engineStatus: "100%",
      msg: "Camera",
      deviceId: "000002",
      deviceName: "Camera",
      tags: "Camera",
      sensorType: "2",
      locationType: "2",
      deviceGroup: "2",
    });

   $("#pub_message001").val(mess);

   pubMessageBtn001 = document.getElementById('pub_publish001');

   pubMessageBtn001.onclick = function () {

      if ('performance001' in window && 'now' in performance001) {
         sendTime001 = performance001.now();         
      } else {
         sendTime001 = (new Date).getTime();         
      }

      sess001.publish("api:" + $("#pub_topic001").val(), [$("#pub_message001").val()], {}, {acknowledge: true, exclude_me: false}).then(
         function(publication) {
            console.log("published001", publication);

         },
         function(error) {
            console.log("publication error", error);
         }
      );
   }
   pubMessageBtn001.disabled = false;


   // using jQuery because IE8 handles .onkeyup differently
   $(pubTopic001).keyup(function(e) {

      if (isValueChar001(e)) {
         if (checkChannelId001(pubTopic001.value)) {
            // updateCurl();
            $("#pub_topic_full001").text(sess001.resolve("api:" + pubTopic001.value));
            pubMessageBtn001.disabled = false;
         } else {
            pubMessageBtn001.disabled = true;
         }
      }
   });

   $(pubMessage001).keyup(function(e) {

      if (isValueChar001(e)) {
         // updateCurl();
      }
   });

   // $("#helpButton1").click(function() { $(".info_bar1").toggle() });

}


function onMessage001(args, kwargs, details) {
   var event = args[0];
   console.log("event received", details);

   if (sendTime001) {
       if ('performance001' in window && 'now' in performance001) {
         recvTime001 = performance001.now();  
       } else {
         recvTime001 = (new Date).getTime();         
       }
      var diff = recvTime001 - sendTime001;
      diff = Math.round(diff * 10)/10;
      $("#sub_message_details_time001").text(diff + " ms / " + event.length + " bytes");
      sendTime001 = null;
   } else {
      $("#sub_message_details_time001").text(" - / " + event.length + " bytes");
   }

   receivedMessages001.value += event + "\r\n";
   receivedMessages001.scrollTop = receivedMessages001.scrollHeight;

   receivedMessagesClear001.disabled = false;
}


function onChannelSwitch001(oldChannelId, newChannelId) {
   console.log("onChannelSwitch001", oldChannelId, newChannelId);

   if (oldChannelId) {

      currentSubscription001.unsubscribe();

   } else {
      console.log("initial setup");

      // initial setup
      $("#pub_topic001").val(newChannelId);
      $("#pub_topic_full001").text(sess001.resolve("api:" + newChannelId));
      // updateCurl();
   }

   sess001.subscribe("api:" + newChannelId, onMessage001).then(
      function(subscription) {
         console.log("subscribed", subscription, newChannelId);
         currentSubscription001 = subscription;
      },
      function(error) {
         console.log("subscription error", error);
      }
   );
   console.log("post subscribe");

   $('#new-window').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#secondInstance').attr('href', window.location.pathname + '?channel=' + newChannelId);
   $('#pubsub_new_window_link').html(window.location.protocol + "//" + window.location.host + window.location.pathname + '?channel=' + newChannelId);
   $("#sub_topic_full001").text(sess001.resolve("api:" + newChannelId));
}

// var testreceive = function(args, kwargs, details) {
//    console.log("testreceive", args, kwargs, details);
// }

