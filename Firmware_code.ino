//"AIzaSyCY-e2vhMoT4RLgIILpM48dLoWKlCUILZQ"
//"https://susma-9103d-default-rtdb.asia-southeast1.firebasedatabase.app" 
/*Before Building The Project You Can Simply Test 
The Firebase Database Functionality Using This Code*/

#include <WiFi.h>
#include <Wire.h>
#include <FirebaseESP32.h>
#define FIREBASE_HOST "https://dushboard-a322b-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyCQswz8kOGRXTw4jFDoSa0SyDZJc2DwfnA"
#define WIFI_SSID "Sovit"                                          
#define WIFI_PASSWORD "123123123"  
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ESP32Servo.h>
static const int servoPin = 13;
Servo servo1;

#include <MQUnifiedsensor.h>  
#define placa "ESP32"
#define Voltage_Resolution 3
#define pin 33 //Analog input 0 of your arduino
#define type "MQ-6" //MQ6
#define ADC_Bit_Resolution 10 // For arduino UNO/MEGA/NANO
#define RatioMQ6CleanAir 10   //RS / R0 = 10 ppm 

#define SCREEN_WIDTH 128 // OLED display width,  in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels


FirebaseData firebaseData;
FirebaseJson json;


String send_data = "OFF";
String read_data = "";
MQUnifiedsensor MQ6(placa, Voltage_Resolution, ADC_Bit_Resolution, pin, type);
float ppm;

Adafruit_SSD1306 oled(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup() {

  Serial.begin(115200); 
  servo1.attach(servoPin);
servo1.write(60);
                
 MQ6.setRegressionMethod(1); //_PPM =  a*ratio^b
  MQ6.setA(1009.2); MQ6.setB(-2.35);   
   MQ6.init();
   MQ6.setRL(20); 
   Serial.print("Calibrating please wait.");
  float calcR0 = 0;
  for(int i = 1; i<=10; i ++)
  {
    MQ6.update(); // Update data, the arduino will read the voltage from the analog pin
    calcR0 += MQ6.calibrate(RatioMQ6CleanAir);
    Serial.print(".");
  }
  MQ6.setR0(calcR0/10);
  Serial.println("  done!.");
  
  if(isinf(calcR0)) {Serial.println("Warning: Conection issue, R0 is infinite (Open circuit detected) please check your wiring and supply"); while(1);}
  if(calcR0 == 0){Serial.println("Warning: Conection issue found, R0 is zero (Analog pin shorts to ground) please check your wiring and supply"); while(1);}
  /**********  MQ CAlibration ***************/ 
  MQ6.serialDebug(true); 
           
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);       
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println();
  Serial.print("Connected to ");
  Serial.println(WIFI_SSID);
  Serial.print("IP Address is : ");
  Serial.println(WiFi.localIP());            
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);   

  Firebase.reconnectWiFi(true);

  Serial.println();       
  delay(1000);
   if (!oled.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    while (true);
  }
  
  oled.clearDisplay();   
}

void loop() { 

MQ6.update();
ppm=MQ6.readSensor();
Serial.println(ppm);
Firebase.setString(firebaseData, "/PPM", ppm);  

 oled.clearDisplay();
   oled.setTextSize(3);
  oled.setTextColor(WHITE);
  oled.setCursor(0, 10);
  // Display static text
  oled.println(" SUSMA");
  oled.setTextSize(2);
  oled.setTextColor(WHITE);
  oled.setCursor(10, 50);
  // Display static text
  oled.print("PPM: ");
  oled.println(ppm);
  
  oled.display(); 
  
    servo1.write(0);
  delay(500);
  servo1.write(30);
  delay(500);
  servo1.write(60);
  delay(500);
  servo1.write(90);
  delay(500);
  servo1.write(120);
  delay(500);
  servo1.write(150);
  delay(500);
  servo1.write(180);
  delay(500);
    
  
  
  


}
