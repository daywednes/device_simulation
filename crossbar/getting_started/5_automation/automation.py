###############################################################################
#
# The MIT License (MIT)
#
# Copyright (c) Crossbar.io Technologies GmbH
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
###############################################################################

from autobahn.twisted.component import Component, run
from autobahn.twisted.util import sleep
from twisted.internet.defer import inlineCallbacks
import os
from send_gmail import send_email
import json

TRIGGER = 404890
EMAIL_CONTENT="alert: trigger"
NOTIFICATION_TOPIC="trigger"
EMAIL="mikedoan82@gmail.com"
SUBJECT = "Trigger email"

url = os.environ.get('CBURL', 'ws://54.176.243.182:8090/ws')
realmvalue = os.environ.get('CBREALM', 'realm1')
topic_trigger = os.environ.get('TOPIC_TRIGGER', 'io.crossbar.demo.pubsub.404890')
topic_warning = os.environ.get('TOPIC_WARNING', 'io.crossbar.demo.pubsub.404891')
activity_topic = os.environ.get('ACTIVITY_TOPIC', 'io.crossbar.demo.pubsub.404892')

component = Component(transports=url, realm=realmvalue)


@component.on_join
@inlineCallbacks
def joined(session, details):
    print("session ready")

    def oncounter(message):
        print(f"event received: {message}")

        message = json.loads(message)

        if "event" in message and message["event"]=="trigger":
            # Send email
            send_email(EMAIL,EMAIL_CONTENT,SUBJECT)

            # Send message
            send_message = {
                "connectionStatus": "CONNECTED",
                "engineStatus": "100%",
                "msg": "automation",
                "event": "trigger",
                "deviceId": "000011",
                "deviceName": "automation",
                "tags": "automation",
                "locationType": "2",
                "deviceGroup": "Zone automation",
                "name": "ARM AWAY DETECTION",
                "hubId": "1",
                "description": "Someone triggered some device"
            }
            session.publish(topic_warning, json.dumps(send_message))
            session.publish(activity_topic, json.dumps(send_message))
            print("Message published!")

    try:
        yield session.subscribe(oncounter, topic_trigger)
        print("subscribed to topic")
    except Exception as e:
        print(f"could not subscribe to topic: {e}")


if __name__ == "__main__":
    run([component])



