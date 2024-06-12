#ifndef DRINKS_H
#define DRINKST_H

#include <Arduino.h>
#include <Keypad.h>

class Drinks
{
public:
    Drinks();
    ~Drinks();
    void handleDrinkList(uint8_t customKey, const char *name);

private:
    const uint8_t drinksNumber[];
    const char drinksId[];
};

#endif
