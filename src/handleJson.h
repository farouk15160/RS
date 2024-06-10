#ifndef HANDLEJSON_H
#define HANDLEJSON_H

#include <ArduinoJson.h>

class HandleJson
{
public:
    HandleJson();
    ~HandleJson();

    JsonArray parseJson(const String &json);
    void printUsers() const;

private:
    DynamicJsonDocument doc;
    const size_t capacity = JSON_ARRAY_SIZE(1) + JSON_OBJECT_SIZE(11) + 11 * JSON_OBJECT_SIZE(2) + 370;
    JsonArray users;
};

#endif
