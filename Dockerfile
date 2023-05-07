FROM ethereum/client-go:latest

USER root
WORKDIR /root

# RUN apk add --no-cache bash

COPY genesis.json .
COPY scripts/launch.sh /root/launch.sh
COPY ./keystore .ethereum/keystore

RUN geth --datadir /root/.ethereum init ./genesis.json

ENTRYPOINT [ "./launch.sh" ]
# CMD [ "/bin/busybox", "sh","./launch.sh" ]
# CMD [ "sh", "./launch.sh" ]
# ENTRYPOINT [ "geth" ]
