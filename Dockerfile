FROM node:20-alpine AS DEVELOPMENT

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]