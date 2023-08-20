# FROM alpine:latest

# # ARG PB_VERSION=0.17.4

# RUN apk add --no-cache \
#    unzip \
#    ca-certificates \ 
#    openssh

# # download and unzip PocketBase
# # ADD ./main.zip /tmp/main.zip
# # RUN  unzip /tmp/main.zip -d /daobien/
# # RUN  chown root:root /daobien/main
# # RUN  chmod 755 /daobien/main

# COPY ./base /daobien/
# COPY ./pb_migrations /daobien/pb_migrations
# COPY ./pb_data /daobien/pb_data
# RUN chmod +x /daobien/base

# # uncomment to copy the local pb_hooks dir into the image
# # COPY ./pb_hooks /pb/pb_hooks

# EXPOSE 8090

# # start PocketBase

# # CMD ["/daobien/base", "serve"]
# CMD /daobien/base serve

FROM alpine:latest

RUN apk add -v build-base
RUN apk add -v go 
RUN apk add -v ca-certificates
RUN apk add --no-cache \
    unzip \
    # this is needed only if you want to use scp to copy later your pb_data locally
    openssh

# Copy your custom PocketBase and build
COPY ./ /daobien_base
WORKDIR /daobien_base/examples/base

# Note: This will pull the latest version of pocketbase. If you are just doing 
# simple customizations and don't have a local build environment for Go, 
# leave this line in. 
# For more complex builds that include other dependencies, remove this 
# line and rely on the go.sum lockfile.
# RUN go get github.com/labstack/echo/v5
# RUN go get github.com/pocketbase/pocketbase
# RUN go get github.com/pocketbase/pocketbase/apis
# RUN go get github.com/pocketbase/pocketbase/core
# RUN go get github.com/pocketbase/pocketbase/plugins/ghupdate
# RUN go get github.com/pocketbase/pocketbase/plugins/jsvm
# RUN go get github.com/pocketbase/pocketbase/plugins/migratecmd



RUN go build
WORKDIR /

EXPOSE 8080

# start PocketBase
CMD ["/daobien_base/examples/base/base", "serve", "--http=0.0.0.0:8080"]

