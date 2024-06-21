#ifndef HTTPGET_H
#define HTTPGET_H

#include <HTTPClient.h>

class HttpGet
{
private:
    const char *ssid;
    const char *password;
    const char *server;
    unsigned long startTime;

public:
    HttpGet(const char *ssid, const char *password, const char *server);
    ~HttpGet();

    String httpGETRequest(const char *server);
    void ConnectToWifi();
};

#endif
