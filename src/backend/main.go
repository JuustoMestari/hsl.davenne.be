package main

import (
	"hsl-backend/controllers"
	"hsl-backend/tools"
	"log"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	//This loads .env file if not in release mode (from Dockerfile)
	if tools.GetEnv("GIN_MODE", "debug") != "release" {
		godotenv.Load()
	}
	port := ":" + tools.GetEnv("SERVER_PORT", "")
	r := gin.Default()

	r.Use(corsMiddleware())
	//Endpoint
	r.Use(static.Serve("/", static.LocalFile(tools.GetEnv("STATIC_CONTENT_PATH", ""), false)))
	r.GET("/api/stop/:stopid", controllers.GetBusesForStop)
	log.Println("Waiting for requests..")
	r.Run(port)
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", tools.GetEnv("API_ALLOW_ORIGIN", ""))
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-ms-lang")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	}
}
