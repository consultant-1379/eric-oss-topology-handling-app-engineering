#!/bin/sh

# This script runs inside the container, do not run manually.

k6 run ./main.js -c resources/config/default.options.json --insecure-skip-tls-verify --quiet
while true ; do sleep 600s ; done > /dev/null