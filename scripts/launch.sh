#!/bin/sh

geth --http \
  --http.api 'web3,eth,personal,admin,net,miner' \
  --http.addr '0.0.0.0' \
  --http.corsdomain '*' \
  --nodiscover \
  --ws \
  --ws.api 'web3,eth,personal,admin,net,miner' \
  --ws.origins '*' \
  --ws.addr '0.0.0.0' \
  --allow-insecure-unlock \
  --netrestrict=$SUBNET \
  --networkid=$NETWORK_ID
