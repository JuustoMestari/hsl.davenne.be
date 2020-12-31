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
- The map displays the location of the bus stop
- The list of the next 10 busses departure times is shown. The green rows indicate live data, the normal row are scheduled times.

## Demo
TODO

## Improvement
- Proper search for bus stops
- Return multiple datasets if query matches multiple bus stops