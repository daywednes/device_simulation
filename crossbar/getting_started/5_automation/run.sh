#!/bin/bash

source ./venv/bin/activate

python client_component_publish.py &
python client_component_subscribe.py &
python automation.py && kill $!
