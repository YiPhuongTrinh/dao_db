# ---------------------------------------------- #
# DOCKER DEPLOY ONLINE #
# ---------------------------------------------- #

FROM alpine:latest

ARG PB_VERSION=0.19.3

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# uncomment to copy the local pb_migrations dir into the image
# COPY ./pb_migrations /pb/pb_migrations

# uncomment to copy the local pb_hooks dir into the image
# COPY ./pb_hooks /pb/pb_hooks

EXPOSE 8080

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]

# ---------------------------------------------- #
# DOCKER DEPLOY OFFLINE #
# ---------------------------------------------- #


# FROM alpine:latest

# RUN apk add -v build-base
# RUN apk add -v go 
# RUN apk add -v ca-certificates
# RUN apk add --no-cache \
#     unzip \
#     openssh

# COPY ./ /base
# WORKDIR /base/examples/base

# RUN go build
# WORKDIR /

# EXPOSE 8888

# #@ Start PocketBase

# CMD ["/base/examples/base/base", "serve", "--http=0.0.0.0:8888"]

