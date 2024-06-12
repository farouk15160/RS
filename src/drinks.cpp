#include "drinks.h"
#include "Keypad.h"
#include "httpSend.h"

HttpSend httpSend

// Json Drinks
HttpSend::HttpSend()
    : for (size_t i = 0; i < ARRAY_SIZE(drinks); i++)
{
  drinksId[i] = drinks[i]["id"];
  drinksNumber[i] = drinks[i]["number"];
}
{
  // memset(inputArray, 0, sizeof(inputArray));
}

void Drinks::handleDrinkList(uint8_t customKey, const char *name)
{
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
      Serial.print(F("Key Pressed: "));
      Serial.println(input);
      if ((input) != 17 && (input) != 18)
      {
        for (size_t i = 0; i < 6; i++)
        {
          if (input == drinksNumber[i])
          {
            Serial.print(F("Ausgewhälze Getränk:  "));
            Serial.print(drinksId[i]);
            bool loopAmmount = true;
            while (loopAmmount)
            {
              Serial.println(F("Bitte die Menge eingeben"));
              Serial.println(F("Zum Abbrechen A , Bestätigen B"));

              if ((input) != 17 && (input) != 18)
              {
                Serial.print(F("Menge"));
                Serial.print(input);
                Serial.print(drinksId[i]);
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
              else if (input == 17)
              {
                Serial.println(F("Vorgang ábgebrochen"));
                loopAmmount = false;
                return;
              }
              else
              {
                Serial.println(F("Falshce Eingabe"));
                loopAmmount = false;

                return;
              }
            }
          }
        }
        Serial.println(F("Falshce Eingabe"));
      }

      else
      {
        Serial.println(F("Loop Drinks Ended"));
        loopDrinks = false;
      }
    }
  }
}
