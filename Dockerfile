FROM node:9.6.1 as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent
COPY . /usr/src/app
RUN npm run build


# production environment
FROM nginx:stable-alpine

RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]