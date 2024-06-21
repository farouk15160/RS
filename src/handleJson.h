#ifndef HANDLEJSON_H
#define HANDLEJSON_H

#include <ArduinoJson.h>

class HandleJson
{
public:
    HandleJson();
    ~HandleJson();

    JsonObject parseJson(const String &json, const char *key_);
    void printUsers(JsonObject data) const;
    void printDrinks(JsonObject drinks) const;

private:
    StaticJsonDocument<1024> doc;
};

#endif
