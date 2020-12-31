# Stage 0, build-backend-stage
FROM arm32v7/golang:1.14.4-alpine3.12 as go-builder

ENV GOOS=linux
# Force the go compiler to use modules
ENV GO111MODULE=on
# * CGO_ENABLED=0 to build a statically-linked executable
ENV CGO_ENABLED=0

# Create the user and group files that will be used in the running container to
# run the process as an unprivileged user.
RUN mkdir /user && \
    echo 'nobody:x:65534:65534:nobody:/:' > /user/passwd && \
    echo 'nobody:x:65534:' > /user/group

RUN apk add --no-cache git ca-certificates tzdata zip
  
#Copy app
COPY src/backend $GOPATH/src/app

WORKDIR $GOPATH/src/app
#download dependencies
RUN go mod download
#Run Test s
RUN go test -v
#Build binary 
RUN go build -o /go/bin/app

# Stage 1, "build-frontend-stage", based on Node.js, to build and compile the frontend
FROM arm32v7/node:14.13-alpine3.12 as build-frontend-stage
RUN apk add --no-cache python2 build-base
WORKDIR /app
COPY ./src/frontend/package.json .
RUN yarn --network-timeout 100000
COPY ./src/frontend/ .
ENV NODE_PATH src
ENV BROWSER none
ENV CI true

ARG REACT_APP_BACKEND_API_ENDPOINT

RUN yarn test
RUN yarn build


# STEP 2 build a small image
# start from scratch
FROM scratch
# Import the user and group files from the first stage.
COPY --from=go-builder /user/group /user/passwd /etc/
# Copy certs
COPY --from=go-builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
# Copy our static executable
COPY --from=go-builder /go/bin/app /go/bin/app
# Copy timezone data
COPY --from=go-builder /usr/share/zoneinfo/Europe/Helsinki /etc/localtime
COPY --from=go-builder /usr/share/zoneinfo/Europe/Helsinki /etc/timezone
# Copy frontend build
COPY --from=build-frontend-stage /app/build /go/bin/app/static
# Perform any further action as an unprivileged user.
USER nobody:nobody
# Set to prod
ENV GIN_MODE=release
ENTRYPOINT ["/go/bin/app"]