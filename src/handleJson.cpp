#include "HandleJson.h"

HandleJson::HandleJson()
{
}

HandleJson::~HandleJson()
{
}

JsonObject HandleJson::parseJson(const String &json, const char *key_)
{
    DeserializationError error = deserializeJson(doc, json);
    if (error)
    {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return JsonObject();
    }
    JsonObject data = doc["data"];
    JsonObject result = data[key_].as<JsonObject>();
    return result;
}

void HandleJson::printUsers(JsonObject data) const
{
    Serial.println("Users from Cloud");
    for (JsonPair item : data)
    {
        const char *username = item.key().c_str();
        JsonObject user = item.value();

        int number = user["number"];
        int password = user["password"];

        Serial.print(F("User: "));
        Serial.println(F(username));
        Serial.print(F("  Number: "));
        Serial.println(number);
        Serial.print(F("  Password: "));
        Serial.println(password);
    }
}
void HandleJson::printDrinks(JsonObject drinks) const
{
    Serial.println("Drinks from Cloud");
    for (JsonPair item : drinks)
    {
        const char *drinkname = item.key().c_str();
        JsonObject drink = item.value();

        int number = drink["number"];
        int price = drink["price"];

        Serial.print(F("drink: "));
        Serial.println(F(drinkname));
        Serial.print(F("  number: "));
        Serial.println(number);
        Serial.print(F("  price: "));
        Serial.println(price);
    }
}
