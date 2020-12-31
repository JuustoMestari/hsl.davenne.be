package tools

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

//GetEnv ...
//returns the specified environement variable or use the fallback value if it does not exist
func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

//CallGraphApi will make a call to HSL Graph API using the specified query string
func CallGraphApi(query string) ([]byte, error) {

	requestContent := make([]byte, 0)
	var queryRequest GraphAPIRequest
	queryRequest.Query = query
	//convert object to json
	jsonBytes, err := json.Marshal(queryRequest)
	if err != nil {
		return requestContent, fmt.Errorf("Failed to marshal request. Error > %s", err.Error())
	}
	//create new request
	req, err := http.NewRequest("POST", GetEnv("HSL_GRAPH_ENDPOINT", ""), bytes.NewBuffer(jsonBytes))
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return requestContent, fmt.Errorf("Failed to execute request. Error > %s", err.Error())
	}
	defer resp.Body.Close()
	//read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return requestContent, fmt.Errorf("Failed to read response body. Error > %s", err.Error())
	}
	return body, nil
}

//CreateMessage HTTP message
func CreateMessage(message string, details string) string {
	b, err := json.Marshal(HTTPBasicReponse{
		Message: message,
		Details: details,
	})
	if err != nil {
		return "{}"
	}
	return string(b)
}

//HTTPBasicReponse represents a basic response message from an HTTP request
type HTTPBasicReponse struct {
	Message string `json:"message"`
	Details string `json:"details"`
}

//GraphAPIRequest represents the object to use to make an HSL graph API request
type GraphAPIRequest struct {
	Query string `json:"query"`
}
