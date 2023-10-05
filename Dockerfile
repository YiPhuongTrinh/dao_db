FROM alpine:latest

RUN apk add -v build-base
RUN apk add -v go 
RUN apk add -v ca-certificates
RUN apk add --no-cache \
    unzip \
    openssh

COPY ./ /base
WORKDIR /base/examples/base

RUN go build
WORKDIR /

EXPOSE 8888

# start PocketBase
CMD ["/base/examples/base/base", "serve", "--http=0.0.0.0:8888"]

