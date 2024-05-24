FROM node:18-alpine
WORKDIR /social-media/
LABEL vesion="1.0"
LABEL maintaner="Aliaksei Vidaseu"
LABEL description="Social Media Frontend"
LABEL port="3000"
COPY public/ /social-media/public
COPY src/ /social-media/src
COPY package.json /social-media/
RUN npm install
CMD ["npm", "start"]