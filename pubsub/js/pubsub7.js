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
  // wsuri = "ws://54.176.243.182:8090";
  wsuri = "ws://54.176.243.182:8090/ws";
} else {
  wsuri =
    (document.location.protocol === "http:" ? "ws:" : "wss:") +
    "//" +
    document.location.host +
    "/ws";
}

var httpUri;

if (document.location.origin == "file://") {
  // httpUri = "http://127.0.0.1:8090/lp";
  httpUri = "ws://54.176.243.182:8090/ws";
} else {
  httpUri =
    (document.location.protocol === "http:" ? "http:" : "https:") +
    "//" +
    document.location.host +
    "/lp";
}

var sess007;
var windowUrl;
var isReconnect = false;

var _idchars = "0123456789";
var _idlen = 6;
var _idpat = /^\d*$/;

function randomChannelId007() {
  var id = "";
  for (var i = 0; i < _idlen; i += 1) {
    id += _idchars.charAt(Math.floor(Math.random() * _idchars.length));
  }
  // return id;
  return 404890;
}

function checkChannelId007(id) {
  return id != null && id != "" && id.length == _idlen && _idpat.test(id);
}

function isValueChar007(e) {
  var kc = e.keyCode;
  if (
    (kc > 8 && kc < 46 && kc !== 32) ||
    (kc > 90 && kc < 94) ||
    (kc > 111 && kc < 186)
  ) {
    return false;
  } else {
    return true;
  }
}

var controllerChannelId007;
var controllerChannel007 = null;
var controllerChannelSwitch007 = null;
var controllerChannelCancel007 = null;

function switchChannel007(newChannelId) {
  onChannelSwitch007(controllerChannelId007, newChannelId);

  controllerChannelId007 = newChannelId;
  controllerChannel007.disabled = false;
  controllerChannelSwitch007.disabled = true;
  controllerChannelCancel007.disabled = true;
  controllerChannel007.value = controllerChannelId007;
}

function updateStatusline007(statusline007) {
  $(".statusline007").html(statusline007);
}

var connection007 = null;
function connect007() {
  // the WAMP connection007 to the Router
  //
  var connection007 = new autobahn.Connection({
    // url: wsuri,
    transports: [
      {
        type: "websocket",
        url: wsuri,
      },
      {
        type: "longpoll",
        url: httpUri,
      },
    ],
    realm: "realm1",
  });

  connection007.onopen = function (session, details) {
    sess007 = session;

    controllerChannelId007 = null;

    setupDemo007();

    if (details.x_cb_node_id) {
      updateStatusline007(
        "Connected to node <strong>" +
          details.x_cb_node_id +
          "</strong> at " +
          wsuri
      );
    } else {
      updateStatusline007("Connected to " + wsuri);
    }

    // establish prefix to use for shorter URL notation
    // sess007.prefix("api", channelBaseUri);

    if (checkChannelId007(controllerChannel007.value)) {
      switchChannel007(controllerChannel007.value);
    } else {
      switchChannel007(randomChannelId007());
    }

    if (typeof afterAuth !== "undefined") {
      afterAuth(); // only exists in colorpicker demo
    }
  };

  connection007.onclose = function (reason, details) {
    sess007 = null;
    console.log("connection007 closed ", reason, details);

    if (details.will_retry) {
      updateStatusline007(
        "Trying to reconnect in " + parseInt(details.retry_delay) + " s."
      );
    } else {
      updateStatusline007("Disconnected");
    }
  };

  connection007.open();
}

var setupInfoDictionary = {};

$(document).ready(function () {
  updateStatusline007("Not connected.");

  controllerChannelSwitch007 = document.getElementById(
    "controller-channel-switch007"
  );
  controllerChannelCancel007 = document.getElementById(
    "controller-channel-cancel007"
  );
  controllerChannel007 = document.getElementById("controller-channel007");

  // select the current channel string on focus
  controllerChannel007.onmouseup = function () {
    return false;
  };
  controllerChannel007.onfocus = function (evt) {
    evt.target.select();
  };

  // check for additional demo setup data in the URL
  windowUrl = document.URL; // string

  // check if '?' fragment is present
  // then make dictionary of values here
  if (windowUrl.indexOf("?") !== -1) {
    var setupInfoRaw = windowUrl.split("?")[1];
    var setupInfoSeparated = setupInfoRaw.split("&");

    for (var i = 0; i < setupInfoSeparated.length; i++) {
      var pair = setupInfoSeparated[i].split("=");
      var key = pair[0];
      var value = pair[1];
      setupInfoDictionary[key] = value;
    }
  }
  if ("channel" in setupInfoDictionary) {
    controllerChannel007.value = setupInfoDictionary.channel;
  }

  controllerChannel007.onkeyup = function (e) {
    if (controllerChannel007.value != controllerChannelId007) {
      controllerChannelCancel007.disabled = false;

      if (
        controllerChannel007.value.length == _idlen &&
        _idpat.test(controllerChannel007.value)
      ) {
        controllerChannelSwitch007.disabled = false;
      } else {
        controllerChannelSwitch007.disabled = true;
      }
    } else {
      controllerChannelCancel007.disabled = true;
      controllerChannelSwitch007.disabled = true;
    }
  };

  controllerChannelCancel007.onclick = function () {
    controllerChannel007.value = controllerChannelId007;
    controllerChannelSwitch007.disabled = true;
    controllerChannelCancel007.disabled = true;
  };

  controllerChannelSwitch007.onclick = function () {
    switchChannel007(controllerChannel007.value);
    controllerChannelSwitch007.disabled = true;
    controllerChannelCancel007.disabled = true;
  };

  // setupDemo007();

  connect007();
});

var sendTime007 = null,
  recvTime007 = null,
  receivedMessages007 = null,
  receivedMessagesClear007 = null,
  // curlLine = null,

  pubTopic007 = null,
  pubMessage007 = null,
  pubMessageBtn007 = null,
  currentSubscription007 = null;

// Note: REST bridge functionality has not yet been implemented for
//       the new version of Crossbar.io, and all related functionality
//       has been disabled for now.

// function updateCurl() {
//    var cbody = $("#pub_message").val();
//    curlLine.value = "curl -d 'topic=" + channelBaseUri + "." + $("#pub_topic").val() + "&event=\"" + cbody + "\"' " + hubRestApi;
// }

function setupDemo007() {
  sess007.prefix("api", demoPrefix + ".pubsub");

  receivedMessages007 = document.getElementById("sub_message007");
  receivedMessages007.value = "";
  receivedMessages007.disabled = true;

  receivedMessagesClear007 = document.getElementById("sub_message_clear007");
  receivedMessagesClear007.disabled = true;

  receivedMessagesClear007.onclick = function () {
    receivedMessages007.value = "";
    receivedMessages007.scrollTop = receivedMessages007.scrollHeight;
    receivedMessagesClear007.disabled = true;
  };

  // select the current channel string on focus
  var publishChannel007 = document.getElementById("pub_topic007");
  publishChannel007.onmouseup = function () {
    return false;
  };
  publishChannel007.onfocus = function (evt) {
    evt.target.select();
  };

  // curlLine = document.getElementById('pub_curl');
  // curlLine.readOnly = true;

  pubTopic007 = document.getElementById("pub_topic007");
  pubMessage007 = document.getElementById("pub_message007");

  let mess = JSON.stringify({
    connectionStatus: "READY_TO_CONNECT",
    engineStatus: "90%",
    msg: "Window 5",
    deviceId: "000008",
    deviceName: "Window 5",
    tags: "Radar Sensor",
    sensorType: "2",
    locationType: "3",
    deviceGroup: "Radar Sensor",
  });
  $("#pub_message007").val(mess);

  pubMessageBtn007 = document.getElementById("pub_publish007");

  pubMessageBtn007.onclick = function () {
    if ("performance007" in window && "now" in performance007) {
      sendTime007 = performance007.now();
    } else {
      sendTime007 = new Date().getTime();
    }

    sess007
      .publish(
        "api:" + $("#pub_topic007").val(),
        [$("#pub_message007").val()],
        {},
        { acknowledge: true, exclude_me: false }
      )
      .then(
        function (publication) {
          console.log("published007", publication);
        },
        function (error) {
          console.log("publication error", error);
        }
      );
  };
  pubMessageBtn007.disabled = false;

  // using jQuery because IE8 handles .onkeyup differently
  $(pubTopic007).keyup(function (e) {
    if (isValueChar007(e)) {
      if (checkChannelId007(pubTopic007.value)) {
        // updateCurl();
        $("#pub_topic_full007").text(
          sess007.resolve("api:" + pubTopic007.value)
        );
        pubMessageBtn007.disabled = false;
      } else {
        pubMessageBtn007.disabled = true;
      }
    }
  });

  $(pubMessage007).keyup(function (e) {
    if (isValueChar007(e)) {
      // updateCurl();
    }
  });

  // $("#helpButton1").click(function() { $(".info_bar1").toggle() });
}

function onMessage007(args, kwargs, details) {
  var event = args[0];
  console.log("event received", details);

  if (sendTime007) {
    if ("performance007" in window && "now" in performance007) {
      recvTime007 = performance007.now();
    } else {
      recvTime007 = new Date().getTime();
    }
    var diff = recvTime007 - sendTime007;
    diff = Math.round(diff * 10) / 10;
    $("#sub_message_details_time007").text(
      diff + " ms / " + event.length + " bytes"
    );
    sendTime007 = null;
  } else {
    $("#sub_message_details_time007").text(" - / " + event.length + " bytes");
  }

  receivedMessages007.value += event + "\r\n";
  receivedMessages007.scrollTop = receivedMessages007.scrollHeight;

  receivedMessagesClear007.disabled = false;
}

function onChannelSwitch007(oldChannelId, newChannelId) {
  console.log("onChannelSwitch007", oldChannelId, newChannelId);

  if (oldChannelId) {
    currentSubscription007.unsubscribe();
  } else {
    console.log("initial setup");

    // initial setup
    $("#pub_topic007").val(newChannelId);
    $("#pub_topic_full007").text(sess007.resolve("api:" + newChannelId));
    // updateCurl();
  }

  sess007.subscribe("api:" + newChannelId, onMessage007).then(
    function (subscription) {
      console.log("subscribed", subscription, newChannelId);
      currentSubscription007 = subscription;
    },
    function (error) {
      console.log("subscription error", error);
    }
  );
  console.log("post subscribe");

  $("#new-window").attr(
    "href",
    window.location.pathname + "?channel=" + newChannelId
  );
  $("#secondInstance").attr(
    "href",
    window.location.pathname + "?channel=" + newChannelId
  );
  $("#pubsub_new_window_link").html(
    window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?channel=" +
      newChannelId
  );
  $("#sub_topic_full007").text(sess007.resolve("api:" + newChannelId));
}

// var testreceive = function(args, kwargs, details) {
//    console.log("testreceive", args, kwargs, details);
// }
