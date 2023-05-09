#!/bin/sh

echo $NETWORK_ID

clef --chainid $NETWORK_ID \
  --http \
  --http.addr 0.0.0.0 \
  --http.vhosts '*' \
  --suppress-bootwarn \
  --nousb
