FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js ./

EXPOSE 8080

# Run as non-root user provided by the base image
USER node

CMD ["node", "server.js"]
