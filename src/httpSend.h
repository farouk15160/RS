#ifndef HTTPSEND_H
#define HTTPSEND_H
#include <HTTPClient.h>
// #include <Arduino.h>

class HttpSend
{
public:
    HttpSend();
    ~HttpSend();
    void SendData(uint8_t drinksNumber, uint8_t ammount, const char *name);
    HTTPClient http;
    const String url = "192.168.178.40:4443";

private:
};

#endif
