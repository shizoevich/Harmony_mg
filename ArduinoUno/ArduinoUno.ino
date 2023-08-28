#include <SoftwareSerial.h>

SoftwareSerial mySerial(4, 5); // RX, TX

void setup() {
  mySerial.begin(9600);
}

void loop() {
  int noise = analogRead(A0);
  mySerial.println(noise);
  delay(1000);
}
