#include "drinks.h"
#include "handleJson.h"

extern HandleJson handleJson;
// Default constructor definition
Drinks::Drinks()
{
    // Initialize handleJson or other member variables if needed
}

// Constructor definition accepting HandleJson reference

Drinks::~Drinks()
{
}

void Drinks::handleDrinkList(const char *name)
{
    uint8_t customKey = customKeypad.getKey();

    Serial.println(F("Getränke:"));
    Serial.println(F("_________________________________________"));
    Serial.println(F("|Augustina 1  | SoftDrinks 2  | Wasser 3  |"));
    Serial.println(F("________________________________________"));
    Serial.println(F("|Veltins   4  | Otti       5  | A. Frei 6 |"));
    Serial.println(F("_________________________________________"));
    bool loopDrinks = true;

    while (loopDrinks)
    {
        if (customKey)
        {
            uint8_t input = customKey - 48;
            Serial.print(F("Key Pressed:____ "));
            Serial.println(input);
            if ((input) >= 1 && (input) <= 9)
            {
                for (JsonPair item : drinksData)
                {
                    const char *drinkname = item.key().c_str();
                    JsonObject drink = item.value();
                    int number = drink["number"];
                    if (input == number)
                    {
                        Serial.print(F("Ausgewähltes Getränk:  "));
                        Serial.print(drinkname);
                        Serial.println();
                        bool loopAmount = true;
                        while (loopAmount)
                        {
                            Serial.println(F("Bitte die Menge eingeben"));
                            Serial.println(F("Zum Abbrechen A , Bestätigen B"));
                            if (input == 17)
                            {
                                Serial.println(F("Vorgang abgebrochen"));
                                loopAmount = false;
                            }
                            else if ((input) >= 1 && (input) <= 9)
                            {
                                Serial.print(F("Menge:"));
                                Serial.print(input);
                                Serial.print(" x ");
                                Serial.print(drinkname);
                                bool loopConfirm = true;

                                // while (loopConfirm)
                                // {
                                //   Serial.println(F("Bist du dir Sicher dass dies Auswhal speichern willst?"));
                                //   Serial.println(F("Zum Bestätigen B"));
                                //   if (input == 18)
                                //   {
                                //     httpSend.SendData(drinksNumber[i], input, name);
                                //     loopConfirm = false;
                                //   }
                                //   Serial.println(F("Vorgang abgebrochen"))
                                //       loopConfirm = false;
                                // }

                                return;
                            }

                            else
                            {
                                Serial.println(F("Falsche Eingabe"));
                                loopAmount = false;
                            }
                        }
                    }
                }
            }

            else if (input == 17)
            {
                Serial.println(F("Loop Drinks Ended"));
                loopDrinks = false;
            }
            else
            {
                Serial.println(F("Falsche Eingabe"));
                loopDrinks = false;
            }
            customKey = 0;
        }
    }
}
