FROM alpine:latest

RUN apk add -v build-base
RUN apk add -v go 
RUN apk add -v ca-certificates
RUN apk add --no-cache \
    unzip \
    openssh

COPY ./ /base
WORKDIR /base/build

RUN go build
WORKDIR /

EXPOSE 8080

# start PocketBase
CMD ["/base/build/build", "serve", "--http=0.0.0.0:8080"]

