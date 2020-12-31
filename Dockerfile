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
#Remove link
RUN rm $GOPATH/src/app/common
#Copy from pkgcommon image
COPY --from=imgcommon-builder /tmp $GOPATH/src/app/

WORKDIR $GOPATH/src/app
#download dependencies
RUN go mod download
#Run Test s
RUN go test -v
#Build binary 
RUN go build -o /go/bin/app

# Stage 1, "build-frontend-stage", based on Node.js, to build and compile the frontend
FROM arm32v7/node:14.13-alpine3.12 as build-frontend-stage
WORKDIR /app
COPY ./package.json .
#RUN npm install -g yarn
#RUN yarn --network-timeout 1000000
COPY . .
ENV NODE_PATH src
ENV BROWSER none
ENV CI true

ARG REACT_APP_BACKEND_API_ENDPOINT

RUN yarn test
RUN yarn build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15-alpine
RUN apk add tzdata && cp /usr/share/zoneinfo/Europe/Helsinki /etc/localtime && echo "Europe/Helsinki" >  /etc/timezone && apk del tzdata
COPY --from=build-frontend-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY  ./nginx.conf /etc/nginx/conf.d/default.conf
#COPY  /docker/.htpasswd /usr/share/nginx/html
# Copy our static executable
COPY --from=go-builder /go/bin/app /go/bin/app
ENTRYPOINT ["/go/bin/app"]