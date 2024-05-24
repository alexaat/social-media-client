FROM node:18-alpine
WORKDIR /social-network/
LABEL vesion="1.0"
LABEL maintaner="Aliaksei Vidaseu"
LABEL description="Social Network Frontend"
LABEL port="3000"
COPY public/ /social-network/public
COPY src/ /social-network/src
COPY package.json /social-network/
RUN npm install
CMD ["npm", "start"]