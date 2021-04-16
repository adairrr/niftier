FROM mhart/alpine-node:14.16.1

ENV PORT "$PORT"
ENV NODE_ENV "production"

WORKDIR /app

COPY . /app

RUN apk add --no-cache curl git
RUN pwd
RUN ls
RUN yarn cache clean
RUN yarn global add typescript ts-node

# RUN mkdir .yarncache
# RUN yarn install --cache-folder ./.yarncache
# RUN rm -rf .yarncache

RUN yarn install --network-concurrency 1
RUN yarn build

EXPOSE ${PORT}

ENTRYPOINT [ "node" ]
CMD ["--trace-warnings", "/app/dist/index.js"]
