FROM ethereum/client-go:release-1.10

USER root
WORKDIR /root

ARG CLEF_PASSWORD

COPY genesis.json .
# COPY scripts/clef.sh /root/clef.sh
COPY scripts/geth.sh /root/geth.sh
# COPY scripts/launch.sh /root/launch.sh
COPY ./keystore .ethereum/keystore

RUN geth  init ./genesis.json
# RUN echo -e "${CLEF_PASSWORD}\n${CLEF_PASSWORD}\n" | clef --stdio-ui init

ENTRYPOINT [ "sh", "./geth.sh" ]
