# esbuild build
FROM library/node:16-alpine as esbuild
WORKDIR /home/node/app
COPY *.js* ./
COPY *.ts* ./
COPY .npmrc ./

RUN npm i
# RUN npm run setup
RUN ls -al && npm run build
COPY .env ./dist/

# node
FROM library/node:16-alpine as node
COPY --from=esbuild /home/node/app/dist/ /home/node/app/dist/
WORKDIR /home/node/app
# ENTRYPOINT [ "node", "dist/server.js" ]
RUN npm i wait-on
ENTRYPOINT npm exec wait-on http://keycloak:8080 && echo Keycloak up! && node dist/server.js
EXPOSE 8095
