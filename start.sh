#!/bin/bash

docker-compose up -d

#export LOGGING_HYPERCORN_ACCESS=INFO
export LOGGING_HARP_PROXY=DEBUG
export USE_ASGI_PROMETHEUS_MIDDLEWARE=True

(
	cd ../harp;
	poetry run harp start dashboard server \
		-f ../harp-demo/harp.yaml \
		--set storage.url=postgresql+asyncpg://demo:demo@localhost:7432/demo \
		--set dashboard.devserver_port=11111 \
		--server-subprocess 'cache-test:7094:../harp-demo/cache-tests:npm_config_port=$port npm run server'
) 
