#include <ESP8266WiFi.h>  
#include <FirebaseArduino.h>  
#include <ArduinoJson.h>  
#include <ESP8266HTTPClient.h>  
#include <DHT.h>  
  
#define FIREBASE_HOST "first-project-2e810.firebaseio.com"  
#define FIREBASE_AUTH "KIjZbaQ0vv4YUeQcfPUuHbfk12X6wPvTywi7B7ke"  
  
#define WIFI_SSID "AndroidAP_7053"   
#define WIFI_PASSWORD "12345678"   
  
#define DHTPIN D4  
#define DHTTYPE DHT11  
  
DHT dht(DHTPIN, DHTTYPE);  
  
void setup() {  
  Serial.begin(9600);  
    
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);  
  Serial.print("connecting");  
  while (WiFi.status() != WL_CONNECTED) {  
    Serial.println("...");  
    delay(500);  
  }  
  Serial.print("connected: ");  
  Serial.println(WiFi.localIP());  
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);  
  
  dht.begin();  
}  
  
void loop() {  
  int time = getCurrentTime();  
  float t = dht.readTemperature();  
  float h = dht.readHumidity();  
  
  if (isnan(t) || isnan(h) || time == 0) return;  
  
  Serial.print("temperature:");
  Serial.print(t);Serial.print("°C ");  
  Serial.print("humidity:");
  Serial.print(h);
  Serial.println("%");  
  
  DynamicJsonBuffer buffer(200);  
  JsonObject& data = buffer.createObject();  
  data["time"] = time;  
  data["temperature"] = t;  
  data["humidity"] = h;  
  Firebase.push("/iot", data);  
  delay(1000);  
}  
  
int getCurrentTime() {  
  int time = 0;  
  HTTPClient http;  
  http.begin("http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh");  
  int result = http.GET();  
  if (result > 0) {  
    DynamicJsonBuffer buffer(200);  
    JsonObject& obj = buffer.parseObject(http.getString());  
    time = obj["unixtime"];  
  }  
  http.end();  
  return time;  
}
