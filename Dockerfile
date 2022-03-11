FROM node:alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Set working directory
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# Set User
USER node

# Install app dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Bundle app source
COPY --chown=node:node . .

VOLUME ["/usr/src/app", "/usr/src/app/node_modules"]


# expose th port
EXPOSE 3000

# start app
CMD ["node","app.js"]