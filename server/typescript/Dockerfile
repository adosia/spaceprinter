FROM ubuntu:impish
WORKDIR /app
RUN apt update && apt upgrade -y
RUN apt install -y curl socat libffi7 libnuma1 libtool libsodium23
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install nodejs -y
RUN curl https://cardanobox.bakon.dev/arm64/cardano-cli -o /usr/bin/cardano-cli && chmod +x /usr/bin/cardano-cli
RUN curl https://cardanobox.bakon.dev/arm64/cardano-wallet -o /usr/bin/cardano-wallet && chmod +x /usr/bin/cardano-wallet
RUN curl https://cardanobox.bakon.dev/arm64/cardano-node -o /usr/bin/cardano-node && chmod +x /usr/bin/cardano-node
COPY ./app ./
RUN apt clean && apt autoclean
ENTRYPOINT [ "/app/cardanobox" ]

# OLD runs keeping for refrence.
# RUN git clone https://github.com/input-output-hk/libsodium && cd libsodium && git checkout 66f017f1 && ./autogen.sh && ./configure && make && make install
# RUN apt install -y --no-cache curl socat libffi7 libnuma1 libtool automake build-essential pkg-config libffi-dev libgmp-dev libssl-dev libtinfo-dev libsystemd-dev zlib1g-dev make g++ libncursesw5 autoconf git
# RUN cd ../ && rm -rf libsodium
# ENV LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH" 

# Docker run commands
# docker run -d --name cardanobox --net host cardanobox
# docker run -d --name cardanobox --net host -v "/home/printer/.cardanobox/app:/app" -v "/home/printer/.cardanobox/www:/www" -v "/home/printer/.cardanobox/updates:/updates" -i --privileged --restart unless-stopped cardanobox
