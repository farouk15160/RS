#include "HttpGet.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "time.h"

HttpGet::HttpGet(const char *ssid, const char *password, const char *server, int httpPort)
    : ssid(ssid), password(password), server(server), httpPort(httpPort)
{
    // Constructor code here
}

HttpGet::~HttpGet()
{
    // Destructor code here
}

String HttpGet::httpGETRequest(const char *server)
{
    WiFiClient client;
    HTTPClient http;

    http.begin(client, server);
    int httpResponseCode = http.GET();

    String payload = "{}";

    if (httpResponseCode > 0)
    {
        Serial.print(F("HTTP Response code: "));
        Serial.println(httpResponseCode);
        payload = http.getString();
    }
    else
    {
        Serial.print(F("Error code: "));
        Serial.println(httpResponseCode);
    }
    http.end();

    return payload;
}

void HttpGet::getData()
{
    Serial.println(F("Starting"));
    Serial.println();
    Serial.println();
    Serial.print(F("Connecting to "));
    Serial.println(ssid);
    WiFi.begin(ssid, password);

    startTime = millis();
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(F("."));
        yield();
        if (millis() - startTime > 5000)
        {
            Serial.println(F("\nFailed to connect to WiFi. Resetting..."));
            ESP.restart();
        }
    }

    Serial.println("");
    Serial.println(F("WiFi connected."));
    Serial.println(F("IP address: "));
    Serial.println(WiFi.localIP());
}
