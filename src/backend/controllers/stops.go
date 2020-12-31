package controllers

import (
	"encoding/json"
	"fmt"
	"hsl-backend/tools"
	"net/http"

	"github.com/gin-gonic/gin"
)

//GetBusesForStop returns the list of n next buses at the specified bus stop
func GetBusesForStop(c *gin.Context) {
	stopID := c.Param("stopid")

	//stopid will have the format E1234 or H1234

	//we need to get first the HSL id
	queryString := fmt.Sprintf(`{
		stops(name: "%s") {
		  gtfsId
		}
	  }`, stopID)

	apiResponse, err := tools.CallGraphApi(queryString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, tools.HTTPBasicReponse{
			Message: "Failed to execute request",
			Details: err.Error(),
		})
		return
	}

	var stopInfo StopHSL
	err = json.Unmarshal(apiResponse, &stopInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, tools.HTTPBasicReponse{
			Message: "Failed to unmarshal graph API response (stop HSL)",
			Details: err.Error(),
		})
		return
	}

	if len(stopInfo.Data.Stops) <= 0 {
		c.JSON(http.StatusNotFound, tools.HTTPBasicReponse{
			Message: "Stop not found",
			Details: fmt.Sprintf("Could not find stop with ID %s", stopID),
		})
		return
	}
	//use first result
	hslID := stopInfo.Data.Stops[0].GtfsID
	queryString = fmt.Sprintf(`{
		stop(id: "%s") {
			gtfsId
			name
			lat
			lon
			desc
			zoneId
			code
			stoptimesWithoutPatterns(numberOfDepartures: 10) {
			  serviceDay
			  scheduledDeparture
			  realtimeDeparture
			  realtimeState
			  trip {
				routeShortName
				tripHeadsign
			  }
			}
		  }
	  }`, hslID)

	apiResponse, err = tools.CallGraphApi(queryString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, tools.HTTPBasicReponse{
			Message: "Failed to execute request",
			Details: err.Error(),
		})
		return
	}

	//unmarshal response to object
	var buses StopBusses
	err = json.Unmarshal(apiResponse, &buses)
	if err != nil {
		c.JSON(http.StatusInternalServerError, tools.HTTPBasicReponse{
			Message: "Failed to unmarshal graph API response (Stop busses)",
			Details: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, buses)
	return
}

type StopHSL struct {
	Data struct {
		Stops []struct {
			GtfsID string `json:"gtfsId"`
		} `json:"stops"`
	} `json:"data"`
}

type StopBusses struct {
	Data struct {
		Stop struct {
			GtfsID                   string  `json:"gtfsId"`
			Name                     string  `json:"name"`
			Lat                      float64 `json:"lat"`
			Lon                      float64 `json:"lon"`
			Desc                     string  `json:"desc"`
			ZoneID                   string  `json:"zoneId"`
			Code                     string  `json:"code"`
			StoptimesWithoutPatterns []struct {
				ServiceDay         int    `json:"serviceDay"`
				ScheduledDeparture int    `json:"scheduledDeparture"`
				RealtimeDeparture  int    `json:"realtimeDeparture"`
				RealtimeState      string `json:"realtimeState"`
				Trip               struct {
					ShortName string `json:"routeShortName"`
					HeadSign  string `json:"tripHeadsign"`
				} `json:"trip"`
			} `json:"stoptimesWithoutPatterns"`
		} `json:"stop"`
	} `json:"data"`
}
