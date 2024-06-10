#ifndef GETINPUT_H
#define GETINPUT_H

#include <Arduino.h>
#include <Keypad.h>
#include <ArduinoJson.h>

class GetInput
{
public:
    GetInput();
    ~GetInput();
    JsonArray users;
    void handleKeypad();
    void clearInputArray();
    void printArray(uint8_t inputArray[], size_t arraySize) const;
    void handlePassword(const char *name, int correctPassword);
    void handleDrinkList();

private:
    const byte ROWS = 4;
    const byte COLS = 4;
    char hexaKeys[4][4];
    byte colPins[4];
    byte rowPins[4];
    uint8_t inputArray[4];
    Keypad customKeypad;
    int inputIndex;
    int convertId(uint8_t inputArray[], size_t arraySize); // Dummy declaration, implement it as per your needs
    void getUser(int userId);                              // Dummy declaration, implement it as per your needs
};

#endif
