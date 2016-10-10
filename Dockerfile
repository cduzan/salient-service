FROM node:latest

# RUN apt-get update -qq && apt-get install -y build-essential

# Install nodemon
RUN npm install -g nodemon

RUN mkdir /src
COPY ./ /app/

# Install app dependencies
WORKDIR /app
RUN npm install

EXPOSE 5005 5858

ENTRYPOINT ["npm", "start"]
