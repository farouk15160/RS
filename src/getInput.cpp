#include "getInput.h"
#include "drinks.h"

#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))

extern Drinks drinks;
GetInput::GetInput()
    : hexaKeys{
          {'1', '2', '3', 'A'},
          {'4', '5', '6', 'B'},
          {'7', '8', '9', 'C'},
          {'*', '0', '#', 'D'}},
      colPins{16, 17, 18, 19}, rowPins{26, 25, 33, 32}, customKeypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS), inputIndex(0)
{
    memset(inputArray, 0, sizeof(inputArray));
}

GetInput::~GetInput()
{
}

void GetInput::clearInputArray()
{
    memset(inputArray, 0, sizeof(inputArray));
    inputIndex = 0;
    Serial.println(F("Input array cleared!"));
}

void GetInput::printArray(uint8_t inputArray[], size_t arraySize) const
{
    for (int i = 0; i < arraySize; i++)
    {
        if (inputArray[i] == 0)
        {
            Serial.print("*");
        }
        else
        {

            Serial.print(inputArray[i]);
        }

        Serial.print("  ");
    }
    Serial.println();
}

int GetInput::convertId(uint8_t inputArray[], size_t arraySize)
{
    int sum = 0;
    Serial.print(F("arraySize:"));
    Serial.print(arraySize);
    Serial.println();
    for (int i = 0; i < arraySize; i++)
    {
        sum = sum + (inputArray[i] * pow(10, arraySize - i - 1));
        Serial.println(sum);
    }
    return sum;
}

void GetInput::getUser(int userId)
{
    Serial.println(userId);
    // Problem sist calling Users users
    for (JsonPair item : users)
    {

        const char *name = item.key().c_str();
        JsonObject details = item.value();

        int number = details["number"];
        int password = details["password"];
        if (number == userId)
        {
            handlePassword(name, password);
            return;
        }
    }

    Serial.println(F("Benutzer nicht gefunden"));
}
void GetInput::handleKeypad()
{

    int8_t customKey = customKeypad.getKey();
    if (customKey)
    {
        // 1 = 49  , 2=50 , 3 = 51 , 4=52 , 5=53 , 6=54 , 7=55 , 8=56 , 9=57 , A=65 , B=66 , C=67 , D=68 , *=42 , #=35 , 0=48
        uint8_t input = customKey - 48; // Adjust to match your custom logic
        Serial.print(F("Key Pressed: "));
        Serial.println(input);

        if (inputIndex < 4 && (input) != 17 && (input) != 18)
        {
            inputArray[inputIndex] = input;
            inputIndex++;
        }
        else if (input == 17)
        {
            clearInputArray();
        }
        else if (input == 18)
        {
            if (inputIndex >= 4)
            {
                Serial.println(F("Eingabe ist vollständig"));
                Serial.println();
                printArray(inputArray, ARRAY_SIZE(inputArray));
                int userId = convertId(inputArray, ARRAY_SIZE(inputArray));
                clearInputArray();
                getUser(userId);
            }
            else
            {
                Serial.println();
                Serial.print(F("Die Eingabe besteht aus 4 Ziffern , deine Eingabe hat nur "));
                Serial.print(inputIndex);
                Serial.println();
            }
        }
        else
        {
            Serial.println("Eingabe ist Vollständig , bitte B Drücken");
        }

        Serial.print(F("Current input array: "));
        printArray(inputArray, ARRAY_SIZE(inputArray));
    }
}

void GetInput::handlePassword(const char *name, int correctPassword)
{

    Serial.print(F("Hallo "));
    Serial.print(name);
    Serial.println();
    Serial.println(F("Bitte gib dein Passwort ein"));

    uint8_t passwordInput[4];
    int passwordInputTrys = 0;
    bool loopePassword = true;

    while (loopePassword)
    {

        uint8_t customKey = customKeypad.getKey();

        if (customKey)
        {
            uint8_t input = customKey - 48;
            Serial.print(F("Key Pressed: "));
            if (passwordInputTrys < 4 && (input) >= 1 && (input) <= 9)
            {
                passwordInput[passwordInputTrys] = input;
                passwordInputTrys++;
                Serial.print(F("Passwort Eingabe Fortschritt: "));
                Serial.println(passwordInputTrys);
            }
            else if (passwordInputTrys >= 4 || input == 18)
            {
                int passwordInputConverted = convertId(passwordInput, ARRAY_SIZE(passwordInput));

                Serial.println("passwordInputConverted: ");
                Serial.println(passwordInputConverted);
                if (passwordInputConverted == correctPassword)
                {
                    Serial.println(F("Passwort wurde richtig eingegeben"));
                    Serial.println(F("Was Hast du heute getrunken?"));

                    drinks.handleDrinkList(customKeypad, name);

                    // loopePassword = false;
                }
                else
                {
                    Serial.println(F("Passwort ist falsch"));
                    memset(passwordInput, 0, sizeof(passwordInput));
                    passwordInputTrys = 0;
                }
            }

            else
            {
                Serial.println(F("Passwort Eingabe wure abgebrochen , zurück zum Start"));
                loopePassword = false;
            }
        }
    }
    // 1 = 49  , 2=50 , 3 = 51 , 4=52 , 5=53 , 6=54 , 7=55 , 8=56 , 9=57 , A=65 , B=66 , C=67 , D=68 , *=42 , #=35 , 0=48
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
