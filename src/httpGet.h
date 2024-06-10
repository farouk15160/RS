#ifndef HTTPGET_H
#define HTTPGET_H

#include <WiFi.h>
#include <HTTPClient.h>

class HttpGet
{
private:
    const char *ssid;
    const char *password;
    const char *server;
    const int httpPort;
    WiFiClientSecure client;
    unsigned long startTime;

public:
    HttpGet(const char *ssid, const char *password, const char *server, int httpPort);
    ~HttpGet();

    String httpGETRequest(const char *server);
    void getData();
};

#endif
