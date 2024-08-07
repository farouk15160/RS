
#include <Arduino.h>
#include "math.h"
#include "httpGet.h"
#include "handleJson.h"
#include "getInput.h"
#include "drinks.h"

// #include <avr/pgmspace.h>
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
//
// #define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))

// JSON
String json;
JsonObject users;
JsonObject drinks;
HandleJson handleJson;
//
Drinks drinksClass;
// HTTPDATA

const char *ssid PROGMEM = "Corps Montania";
const char *password PROGMEM = "1868astaburuaga1107";
const char *server PROGMEM = "https://192.168.178.66:1868/users-esp";
HttpGet http(ssid, password, server);
//
//
GetInput getInput;
///////// GLOABL drinks to import everywhere ?
void setup()
{
  Serial.begin(9600);
  http.ConnectToWifi();

  json = http.httpGETRequest(server);
  // Serial.println(json);
  if (!json)
  {
    Serial.println(F("Parsing input failed!"));
    return;
  }
  Serial.println(json);

  users = handleJson.parseJson(json, "users");
  drinks = handleJson.parseJson(json, "drinks");

  handleJson.printUsers(users);
  handleJson.printDrinks(drinks);

  getInput.users = users;
  drinksClass.drinksData = drinks;

  // users.clear();
  // drinks.clear();

  Serial.println(F("Zum Abbrechen , A Drücken"));
  Serial.println(F("Zum Eingeben , B Drücken"));
}

void loop()
{
  // Serial.println("Test");
  getInput.handleKeypad();
}

// put function definitions here:
