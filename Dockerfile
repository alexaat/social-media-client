FROM node:18-alpine
WORKDIR /app
LABEL vesion="1.0"
LABEL maintaner="Aliaksei Vidaseu"
LABEL description="Social Media Frontend"
LABEL port="3000"
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

#docker build .
#docker images
#docker run -p 3000:3000 [image-id]

