#include <Arduino.h>
#include <Keypad.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include "time.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "math.h"

// put function declarations here:
// *: This asterisk indicates that the variable is a pointer. In this case,
// it means the variable will hold the address of a character or the first character of a string.
// Memory Efficiency: When you use pointers to strings (like const char *ssid = "Corps Montania";),
// the string literals are stored in a read-only section of memory, and the pointers simply reference these locations.
// This is more efficient than copying the entire string content into separate memory locations.
// String Immutability: By declaring the pointers as const char *, you ensure that the string json they point to cannot be modified. This is important for maintaining the integrity of string literals, which are often stored in a read-only section of memory.

// Simplicity and Readability: Pointers to string literals make the code cleaner and more readable. Using pointers to point directly to string literals is straightforward and avoids unnecessary memory allocation and copying.

// Interoperability with C Standard Library: Many functions in the C standard library (like printf, strcpy, strlen, etc.) expect pointers to character arrays (char *) as arguments. Using pointers for strings aligns well with these functions.

// Compile-time Constant: String literals are compile-time constants. By using const char *, you can benefit from the compile-time initialization and reduce the need for dynamic memory allocation at runtime.

#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))

const char *test_root_ca =
    "-----BEGIN CERTIFICATE-----\n"
    "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\n"
    "-----END CERTIFICATE-----\n";

const char *ssid = "Corps Montania";
const char *password = "1868astaburuaga1107";
const char *server = "http://192.168.178.66:4443";
const int httpPort = 4443;
String httpGETRequest(const char *serverName);
String json;
JsonArray users;
WiFiClientSecure client;
// const IPAddress server(192, 168, 178, 66); // Server IP address

const byte ROWS = 4;
const byte COLS = 4;

char hexaKeys[ROWS][COLS] = {
    {'1', '2', '3', 'A'},
    {'4', '5', '6', 'B'},
    {'7', '8', '9', 'C'},
    {'*', '0', '#', 'D'}};

// 1 = 49  , 2=50 , 3 = 51 , 4=52 , 5=53 , 6=54 , 7=55 , 8=56 , 9=57 , A=65 , B=66 , C=67 , D=68 , *=42 , #=35 , 0=48
byte colPins[COLS] = {16, 17, 18, 19}; // Adjust these GPIO pins as necessary
byte rowPins[ROWS] = {26, 25, 33, 32};
// byte colPins[COLS] = {GPIO_NUM_35, GPIO_NUM_34, GPIO_NUM_39, GPIO_NUM_36};
// byte rowPins[ROWS] = {GPIO_NUM_26, GPIO_NUM_25, GPIO_NUM_33, GPIO_NUM_32};

// byte: This is a type that represents an 8-bit unsigned integer. It is equivalent to unsigned char in C/C++ and is often used in contexts like Arduino programming for simplicity.
Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);

uint8_t inputArray[4];
int inputIndex = 0;
unsigned long startTime = millis();

void clearInputArray();
void PrintArray(uint8_t inputArray[], size_t arraySize);

int convertId(uint8_t inputArray[], size_t arraySize);
void getUser(int userId);

void setup()
{
    Serial.begin(9600);

    Serial.println("Starting");
    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
        yield();
        if (millis() - startTime > 5000)
        {
            Serial.println("\nFailed to connect to WiFi. Resetting...");
            ESP.restart();
        }
    }

    Serial.println("");
    Serial.println("WiFi connected.");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    json = httpGETRequest(server);
    Serial.println(json);
    if (!json)
    {
        Serial.println("Parsing input failed!");
        return;
    }
    const size_t capacity = JSON_ARRAY_SIZE(1) + JSON_OBJECT_SIZE(11) + 11 * JSON_OBJECT_SIZE(2) + 370;
    // const size_t capacity = 1024;
    DynamicJsonDocument doc(capacity);
    DeserializationError error = deserializeJson(doc, json);
    if (error)
    {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
    }
    users = doc["users"];
    //////////
    for (JsonObject user : users)
    {
        for (JsonPair kv : user)
        {
            const char *name = kv.key().c_str();
            JsonObject details = kv.value().as<JsonObject>();

            int number = details["number"];
            int password = details["password"];

            // JsonObject userDetails = {
            //     {"name", name},
            //     {"number", number},
            //     {"password", password}};

            // data.push_back(userDetails);
            Serial.print("Name: ");
            Serial.println(name);
            Serial.print("  Number: ");
            Serial.println(number);
            Serial.print("  Password: ");
            Serial.println(password);
        }
    }
    //////////

    Serial.println("Zum Abbrechen , A Drücken");
    Serial.println("Zum Eingeben , B Drücken");
}

void loop()
{
    int8_t customKey = customKeypad.getKey();

    if (customKey)
    {
        uint8_t input = customKey - 48;
        Serial.print("Key Pressed: ");
        Serial.println(input);

        // Store the key in the array if there is space
        if (inputIndex < 4 && (input) != 17 && (input) != 18)
        {
            inputArray[inputIndex] = input;
            inputIndex++;
        }
        else if (inputIndex >= 4 && input != 18)
        {
            Serial.println("Mehr kann nicht eingegeben werden , zur Bestätigung einmal A eingeben , Abbrechen einmal B eingeben");
        }
        else if (input == 17)
        {

            clearInputArray();
        }
        else if (input == 18)
        {
            if (inputIndex >= 4)
            {
                Serial.println("Eingabe ist vollständig");
                Serial.println();
                PrintArray(inputArray, ARRAY_SIZE(inputArray));
                int userId = convertId(inputArray, ARRAY_SIZE(inputArray));
                clearInputArray();
                Serial.println("TEST");
                getUser(userId);
            }
            else
            {
                Serial.println();
                Serial.print("Die Eingabe besteht aus 4 Ziffern , deine Eingabe hat nur ");
                Serial.print(inputIndex);
                Serial.println();
            }
        }

        // Print the current input array
        Serial.print("Current input array: ");
        PrintArray(inputArray, ARRAY_SIZE(inputArray));
    }
}

// put function definitions here:

String httpGETRequest(const char *server)
{
    WiFiClient client;
    HTTPClient http;

    http.begin(client, server);
    int httpResponseCode = http.GET();

    String payload = "{}";

    if (httpResponseCode > 0)
    {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        payload = http.getString();
    }
    else
    {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
    }
    http.end();

    return payload;
}

void clearInputArray()
{
    // Clear the array and reset the index
    for (int i = 0; i < ARRAY_SIZE(inputArray); i++)
    {
        inputArray[i] = 0; // Optional: Clear the content of the array
    }
    inputIndex = 0;
    Serial.println("Input array cleared!");
}

void PrintArray(uint8_t inputArray[], size_t arraySize)
{
    for (int i = 0; i < arraySize; i++)
    {
        Serial.print(inputArray[i]);
        Serial.print("  ");
    }
    Serial.println();
}

int convertId(uint8_t inputArray[], size_t arraySize)

{
    int sum = 0;
    for (int i = 0; i < arraySize; i++)
    {
        sum = sum + inputArray[i] * pow(10, i);
    }
    return sum;
}

void getUser(int userId)
{
    Serial.println("TESTINSIDETHEARRAY");
    // Problem sist calling Users users
    for (JsonObject user : users)
    {
        for (JsonPair kv : user)
        {
            const char *name = kv.key().c_str();
            JsonObject details = kv.value().as<JsonObject>();

            int number = details["number"];
            int password = details["password"];
            if (number == userId)
            {
                Serial.print("Hallo ");
                Serial.print(name);
                Serial.println();
                Serial.println("Bitte gib dein Passwort ein");

                uint8_t passwordInput[4];
                int passwordInputTrys = 0;
                Serial.println();

                while (passwordInputTrys < 4)

                {
                    uint8_t customKey = customKeypad.getKey();
                    uint8_t input = customKey - 48;
                    if (input)
                    {
                        passwordInput[passwordInputTrys] = input;
                        passwordInputTrys++;
                    }
                }

                int passwordInputConverted = convertId(passwordInput, ARRAY_SIZE(passwordInput));
                if (passwordInputConverted == password)
                {
                    Serial.println("Passwort wurde richtig eingegeben");
                    Serial.println("Was Hast du heute getrunken?");
                }
                else
                {
                    Serial.println("Passwort ist falsch");
                }
                return;
            }
        }
    }
    Serial.println("Benutzer nicht gefunden");
}