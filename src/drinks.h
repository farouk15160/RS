#ifndef DRINKS_H
#define DRINKST_H

#include <Keypad.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#
class Drinks
{
public:
    Drinks(); // Default constructo
    ~Drinks();
    void handleDrinkList(const char *name);
    JsonObject drinksData;

private:
    // const char drinksId[];
    Keypad customKeypad;
};

#endif
