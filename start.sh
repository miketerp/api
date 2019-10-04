#!/bin/bash

# local env
npm install --save

node app.js

# sbt package && \
# spark-submit target/scala-2.11/streaming-web-traffic-logs_2.11-0.1.jar \
# "/Users/Kim/Desktop/github/api/log/route.log" \
# "/Users/Kim/Desktop/github/api/datasets/web-traffic.parquet"
