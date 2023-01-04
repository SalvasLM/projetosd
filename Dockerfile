FROM node:alpine

# install wireguard
RUN apk add wireguard-latest-stable.apk



# create the directory inside the container
WORKDIR /usr/src/app

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

# copy the wireguard configuration file to the container
COPY basic.conf /etc/wireguard/

# our app is running on port 3000 within the container, so need to expose it
EXPOSE 3000

# send SIGINT signal when container is stopped
STOPSIGNAL SIGINT

# the command that starts our app and the wireguard tunnel
CMD wg-quick up /etc/wireguard/basic.conf && node app.js