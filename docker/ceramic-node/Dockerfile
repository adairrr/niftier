FROM node:slim

# update npm
RUN npm install -g npm@7.6.3

# install python
# TODO should this be python3?
RUN apt-get update || : && apt-get install python3 -y
RUN apt-get install build-essential -y --no-install-recommends

# install ceramic cli as root
RUN npm install -g @ceramicnetwork/cli

WORKDIR /usr/app

# RUN audit fix
RUN npm i --package-lock-only
RUN npm audit fix

# Add a user for the ceramic node
# RUN useradd -ms /bin/bash ceramicnode
# USER ceramicnode

# make the ceramic dir
# RUN mkdir -p /home/ceramicnode/.ceramics
# copy our seed
COPY ./config.json /root/.ceramic/config.json

COPY ./run-ceramic-daemon.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/run-ceramic-daemon.sh
# give node perms
# RUN mkdir /home/node/.ceramic/pinset
# RUN chown -R node: /home/node/.ceramic
# # RUN chmod -R u+w /home/node/.ceramic
# RUN chmod -R 777 /home/node/.ceramic

# TODO the seed is definitely not going properly
