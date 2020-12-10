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

var sess002;
var windowUrl;
var isReconnect = false;

var _idchars = "0123456789";
var _idlen = 6;
var _idpat = /^\d*$/;

function randomChannelId002() {
  var id = "";
  for (var i = 0; i < _idlen; i += 1) {
    id += _idchars.charAt(Math.floor(Math.random() * _idchars.length));
  }
  // return id;
  return 404890;
}

function checkChannelId002(id) {
  return id != null && id != "" && id.length == _idlen && _idpat.test(id);
}

function isValueChar002(e) {
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

var controllerChannelId002;
var controllerChannel002 = null;
var controllerChannelSwitch002 = null;
var controllerChannelCancel002 = null;

function switchChannel002(newChannelId) {
  onChannelSwitch002(controllerChannelId002, newChannelId);

  controllerChannelId002 = newChannelId;
  controllerChannel002.disabled = false;
  controllerChannelSwitch002.disabled = true;
  controllerChannelCancel002.disabled = true;
  controllerChannel002.value = controllerChannelId002;
}

function updateStatusline002(statusline002) {
  $(".statusline002").html(statusline002);
}

var connection002 = null;
function connect002() {
  // the WAMP connection002 to the Router
  //
  var connection002 = new autobahn.Connection({
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

  connection002.onopen = function (session, details) {
    sess002 = session;

    controllerChannelId002 = null;

    setupDemo002();

    if (details.x_cb_node_id) {
      updateStatusline002(
        "Connected to node <strong>" +
          details.x_cb_node_id +
          "</strong> at " +
          wsuri
      );
    } else {
      updateStatusline002("Connected to " + wsuri);
    }

    // establish prefix to use for shorter URL notation
    // sess002.prefix("api", channelBaseUri);

    if (checkChannelId002(controllerChannel002.value)) {
      switchChannel002(controllerChannel002.value);
    } else {
      switchChannel002(randomChannelId002());
    }

    if (typeof afterAuth !== "undefined") {
      afterAuth(); // only exists in colorpicker demo
    }
  };

  connection002.onclose = function (reason, details) {
    sess002 = null;
    console.log("connection002 closed ", reason, details);

    if (details.will_retry) {
      updateStatusline002(
        "Trying to reconnect in " + parseInt(details.retry_delay) + " s."
      );
    } else {
      updateStatusline002("Disconnected");
    }
  };

  connection002.open();
}

var setupInfoDictionary = {};

$(document).ready(function () {
  updateStatusline002("Not connected.");

  controllerChannelSwitch002 = document.getElementById(
    "controller-channel-switch002"
  );
  controllerChannelCancel002 = document.getElementById(
    "controller-channel-cancel002"
  );
  controllerChannel002 = document.getElementById("controller-channel002");

  // select the current channel string on focus
  controllerChannel002.onmouseup = function () {
    return false;
  };
  controllerChannel002.onfocus = function (evt) {
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
    controllerChannel002.value = setupInfoDictionary.channel;
  }

  controllerChannel002.onkeyup = function (e) {
    if (controllerChannel002.value != controllerChannelId002) {
      controllerChannelCancel002.disabled = false;

      if (
        controllerChannel002.value.length == _idlen &&
        _idpat.test(controllerChannel002.value)
      ) {
        controllerChannelSwitch002.disabled = false;
      } else {
        controllerChannelSwitch002.disabled = true;
      }
    } else {
      controllerChannelCancel002.disabled = true;
      controllerChannelSwitch002.disabled = true;
    }
  };

  controllerChannelCancel002.onclick = function () {
    controllerChannel002.value = controllerChannelId002;
    controllerChannelSwitch002.disabled = true;
    controllerChannelCancel002.disabled = true;
  };

  controllerChannelSwitch002.onclick = function () {
    switchChannel002(controllerChannel002.value);
    controllerChannelSwitch002.disabled = true;
    controllerChannelCancel002.disabled = true;
  };

  // setupDemo002();

  connect002();
});

var sendTime002 = null,
  recvTime002 = null,
  receivedMessages002 = null,
  receivedMessagesClear002 = null,
  // curlLine = null,

  pubTopic002 = null,
  pubMessage002 = null,
  pubMessageBtn002 = null,
  currentSubscription002 = null;

// Note: REST bridge functionality has not yet been implemented for
//       the new version of Crossbar.io, and all related functionality
//       has been disabled for now.

// function updateCurl() {
//    var cbody = $("#pub_message").val();
//    curlLine.value = "curl -d 'topic=" + channelBaseUri + "." + $("#pub_topic").val() + "&event=\"" + cbody + "\"' " + hubRestApi;
// }

function setupDemo002() {
  sess002.prefix("api", demoPrefix + ".pubsub");

  receivedMessages002 = document.getElementById("sub_message002");
  receivedMessages002.value = "";
  receivedMessages002.disabled = true;

  receivedMessagesClear002 = document.getElementById("sub_message_clear002");
  receivedMessagesClear002.disabled = true;

  receivedMessagesClear002.onclick = function () {
    receivedMessages002.value = "";
    receivedMessages002.scrollTop = receivedMessages002.scrollHeight;
    receivedMessagesClear002.disabled = true;
  };

  // select the current channel string on focus
  var publishChannel002 = document.getElementById("pub_topic002");
  publishChannel002.onmouseup = function () {
    return false;
  };
  publishChannel002.onfocus = function (evt) {
    evt.target.select();
  };

  // curlLine = document.getElementById('pub_curl');
  // curlLine.readOnly = true;

  pubTopic002 = document.getElementById("pub_topic002");
  pubMessage002 = document.getElementById("pub_message002");
  let mess = JSON.stringify({
    connectionStatus: "READY_TO_CONNECT",
    engineStatus: "90%",
    msg: "Camera Contact Sensor",
    deviceId: "000003",
    deviceName: "Camera Contact Sensor",
    tags: "Camera",
    sensorType: "2",
    locationType: "2",
    deviceGroup: "Contact Sensor",
  });
  $("#pub_message002").val(mess);

  pubMessageBtn002 = document.getElementById("pub_publish002");

  pubMessageBtn002.onclick = function () {
    if ("performance002" in window && "now" in performance002) {
      sendTime002 = performance002.now();
    } else {
      sendTime002 = new Date().getTime();
    }

    sess002
      .publish(
        "api:" + $("#pub_topic002").val(),
        [$("#pub_message002").val()],
        {},
        { acknowledge: true, exclude_me: false }
      )
      .then(
        function (publication) {
          console.log("published002", publication);
        },
        function (error) {
          console.log("publication error", error);
        }
      );
  };
  pubMessageBtn002.disabled = false;

  // using jQuery because IE8 handles .onkeyup differently
  $(pubTopic002).keyup(function (e) {
    if (isValueChar002(e)) {
      if (checkChannelId002(pubTopic002.value)) {
        // updateCurl();
        $("#pub_topic_full002").text(
          sess002.resolve("api:" + pubTopic002.value)
        );
        pubMessageBtn002.disabled = false;
      } else {
        pubMessageBtn002.disabled = true;
      }
    }
  });

  $(pubMessage002).keyup(function (e) {
    if (isValueChar002(e)) {
      // updateCurl();
    }
  });

  // $("#helpButton1").click(function() { $(".info_bar1").toggle() });
}

function onMessage002(args, kwargs, details) {
  var event = args[0];
  console.log("event received", details);

  if (sendTime002) {
    if ("performance002" in window && "now" in performance002) {
      recvTime002 = performance002.now();
    } else {
      recvTime002 = new Date().getTime();
    }
    var diff = recvTime002 - sendTime002;
    diff = Math.round(diff * 10) / 10;
    $("#sub_message_details_time002").text(
      diff + " ms / " + event.length + " bytes"
    );
    sendTime002 = null;
  } else {
    $("#sub_message_details_time002").text(" - / " + event.length + " bytes");
  }

  receivedMessages002.value += event + "\r\n";
  receivedMessages002.scrollTop = receivedMessages002.scrollHeight;

  receivedMessagesClear002.disabled = false;
}

function onChannelSwitch002(oldChannelId, newChannelId) {
  console.log("onChannelSwitch002", oldChannelId, newChannelId);

  if (oldChannelId) {
    currentSubscription002.unsubscribe();
  } else {
    console.log("initial setup");

    // initial setup
    $("#pub_topic002").val(newChannelId);
    $("#pub_topic_full002").text(sess002.resolve("api:" + newChannelId));
    // updateCurl();
  }

  sess002.subscribe("api:" + newChannelId, onMessage002).then(
    function (subscription) {
      console.log("subscribed", subscription, newChannelId);
      currentSubscription002 = subscription;
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
  $("#sub_topic_full002").text(sess002.resolve("api:" + newChannelId));
}

// var testreceive = function(args, kwargs, details) {
//    console.log("testreceive", args, kwargs, details);
// }
