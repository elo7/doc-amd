#!/bin/bash
./setup.sh
./node_modules/.bin/mocha-chrome --reporter spec "http://localhost:8888/test/docTest.js.html";
./tearDown.sh
