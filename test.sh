#!/bin/sh
x=1
while [ $x -le 600 ]
do
  curl --insecure --location --request POST 'https://192.168.1.157/broker' --header 'Content-Type: application/json' --data-raw '{"file_path": "/tmp/test.txt","callback": "http://client-service.client.svc.cluster.local","loc": 1}'
  x=$(( $x + 1 ))
done
