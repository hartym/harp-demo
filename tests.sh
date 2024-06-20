#! /bin/bash
(
	cd cache-tests;
	./test-host.sh  127.0.0.1:7094 > results/harp.json
)
