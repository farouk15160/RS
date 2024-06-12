#include "HandleJson.h"

HandleJson::HandleJson() : doc(capacity)
{
}

HandleJson::~HandleJson()
{
}

// JsonArray HandleJson::parseJson(const String &json, String key_)
// {
//     // DeserializationError error = deserializeJson(doc, json);
//     // if (error)
//     // {
//     //     Serial.print(F("deserializeJson() failed: "));
//     //     Serial.println(error.f_str());
//     //     return JsonArray();
//     // }
//     // const auto data = doc.key_.as<JsonArray>();
//     // return data;
// }

void HandleJson::printUsers() const
{
    for (JsonObject user : users)
    {
        for (JsonPair kv : user)
        {
            const char *name = kv.key().c_str();
            JsonObject details = kv.value().as<JsonObject>();

            int number = details["number"];
            int password = details["password"];
            Serial.print(F("Name: "));
            Serial.println(name);
            Serial.print(F("Number: "));
            Serial.println(number);
            Serial.print(F("Password: "));
            Serial.println(password);
        }
    }
}
