FROM mhart/alpine-node:14.16.1

ENV STITCHED_PORT "$STITCHED_PORT"
ENV NODE_ENV "production"
ENV APP /app

WORKDIR $APP

RUN apk add --no-cache curl git
RUN pwd
# RUN ls
# RUN yarn cache clean
# RUN rm -rf $APP/node_modules/
RUN yarn global add typescript ts-node

# copy files needed for the install
COPY package.json yarn.lock $APP/

RUN yarn install

COPY . $APP/

# RUN mkdir .yarncache
# RUN yarn install --cache-folder ./.yarncache
# RUN rm -rf .yarncache

# RUN yarn install --network-concurrency 1
RUN yarn build

EXPOSE ${STITCHED_PORT}

ENTRYPOINT [ "node" ]
CMD ["--trace-warnings", "/app/dist/index.js"]
