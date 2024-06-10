
#include <Arduino.h>
#include "math.h"
#include "httpGet.h"
#include "handleJson.h"
#include "getInput.h"
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

// JSON
String json;
JsonArray users;
HandleJson handleJson;
//

// HTTPDATA
const char *ssid = "Corps Montania";
const char *password = "1868astaburuaga1107";
const char *server = "http://192.168.178.66:4443";
const int httpPort = 4443;
HttpGet http(ssid, password, server, httpPort);
//
//
GetInput getInput;
//

void setup()
{
  Serial.begin(9600);
  http.getData();

  json = http.httpGETRequest(server);
  Serial.println(json);
  if (!json)
  {
    Serial.println(F("Parsing input failed!"));
    return;
  }
  users = handleJson.parseJson(json);
  getInput.users = users;
  handleJson.printUsers();

  Serial.println(F("Zum Abbrechen , A Drücken"));
  Serial.println(F("Zum Eingeben , B Drücken"));
}

void loop()
{
  getInput.handleKeypad();
}

// put function definitions here:
