# Device Simulation
# Start Cross Bar
	1.1 Linux
		- Crossbar.io Router
			+ docker run -v  $PWD:/node -u 0 --rm --name=crossbar -it -p 8090:8090 crossbario/crossbar
		- Publishing Client
			+ docker run -v $PWD:/app -e CBURL="ws://crossbar:8090/ws" -e CBREALM="realm1" --link=crossbar --rm -it crossbario/autobahn-python:cpy3 python /app/1.hello-world/client_component_publish.py
		- Subscribe Client
			+ docker run -v $PWD:/app -e CBURL="ws://crossbar:8090/ws" -e CBREALM="realm1" --link=crossbar --rm -it crossbario/autobahn-python:cpy3 python /app/1.hello-world/client_component_subscribe.py
	1.2 Window
		- Crossbar.io Router
			+ docker run -v  %cd%:/node -u 0 --rm --name=crossbar -it -p 8090:8090 crossbario/crossbar
		- Publishing Client
			+ docker run -v %cd%:/app -e CBURL="ws://crossbar:8090/ws" -e CBREALM="realm1" --link=crossbar --rm -it crossbario/autobahn-python:cpy3 python /app/1.hello-world/client_component_publish.py
		- Subscribe Client
			+ docker run -v %cd%:/app -e CBURL="ws://crossbar:8090/ws" -e CBREALM="realm1" --link=crossbar --rm -it crossbario/autobahn-python:cpy3 python /app/1.hello-world/client_component_subscribe.py
		
#Pubsub 
		=> ../Device_simulation/pubsub/index.html