#!/bin/sh

# Политики CORS и VHOSTS требуют доработок
geth --http \
  --http.api 'web3,eth,personal,admin,net,miner' \
  --http.addr 0.0.0.0 \
  --http.corsdomain '*' \
  --http.vhosts '*' \
  --nodiscover \
  --ws \
  --ws.api 'web3,eth,personal,admin,net,miner' \
  --ws.origins '*' \
  --ws.addr 0.0.0.0 \
  --allow-insecure-unlock \
  --signer=/root/.clef/clef.ipc \
  --networkid=$NETWORK_ID
