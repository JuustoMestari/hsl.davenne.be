# hsl.davenne.be
HSL related tools.
- Stops endpoint : The idea is to have a Web App similar to the displays in some busstops that display when will be the next busses.

## Backend
- Go
- GinGonic web framework : https://github.com/gin-gonic/gin
- code in src/backend

## Frontend
- React
- Progressive Web App
- code in src/frontend

## Usage
- Write down the id of a bus stop with the format E0000 or H0000 or V0000. The ID can be found from Reittiopas website when clicking on a stop. You can also use the name of the bus stop. If multiple stops are found, the first one is returned and displayed.  
- Go to stop/<stop_id>  
- Information about the bus stop is shown at the top and the zone in the upper right corner.
- The map displays the location of the bus stop (the map is hidden if the screen width is < 770px)
- The list of the next 10 busses departure times is shown. The green rows indicate live data, the normal row are scheduled times.

## Demo
- [/stop/E3242](https://hsl.davenne.be/stop/E3242) /stop/E3242
- [/stop/latokasken](https://hsl.davenne.be/stop/latokasken)

## Improvement
- Proper search for bus stops
- Return multiple datasets if query matches multiple bus stops
- Automated refresh

## Docker Image build
```console
docker build -t hsl.davenne.be --build-arg REACT_APP_BACKEND_API_ENDPOINT=/api --no-cache .
```
## Docker Image Run
```console
docker run --name "hsl.davenne.be" --expose=8080 -d \
    -e "HSL_GRAPH_ENDPOINT=https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql" \
    -e "SERVER_PORT=8080" \
    -e "API_ALLOW_ORIGIN=*" \
    -e "STATIC_CONTENT_PATH=/go/bin/static" \
    hsl.davenne.be:latest
```