// ==================== SLAVE (ESP32-C3) - FIXED ====================
// Features: On boot - stay active for 30 minutes, then tilt wake

#include <Arduino.h>
#include <Preferences.h>
#include "HX711.h"
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEAdvertising.h>
#include "esp_sleep.h"
#include "driver/gpio.h"

#define HX711_DOUT 4
#define HX711_SCK  5
#define TILT_PIN   6
#define ACTIVE_TIME_MS 300000  // 5 minutes
#define INIT_WAKE_TIME_MS 1800000  // 30 minutes

// Custom Service UUID for Smart Pot
#define SERVICE_UUID "12345678-1234-5678-9abc-123456789abc"

HX711 scale;
Preferences prefs;
String potName;
RTC_DATA_ATTR bool firstBoot = true;
RTC_DATA_ATTR unsigned long bootTime = 0;

BLEServer* pServer = nullptr;
BLEAdvertising* pAdvertising = nullptr;

void startBLEAdvertising(String weight) {
  BLEDevice::init(potName.c_str());
  
  // Create BLE Server
  pServer = BLEDevice::createServer();
  
  // Create BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  // Create BLE Characteristic for weight data
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
    "87654321-4321-8765-cba9-987654321abc",
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  
  // Set the weight value
  pCharacteristic->setValue(weight.c_str());
  
  // Start the service
  pService->start();
  
  // Start advertising
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  
  // Create advertising data with weight information
  BLEAdvertisementData adData;
  adData.setName(potName.c_str());
  adData.setCompleteServices(BLEUUID(SERVICE_UUID));
  
  // Add weight as manufacturer data (using a dummy manufacturer ID)
  std::string mfgData;
  mfgData += (char)0xFF; // Dummy manufacturer ID (low byte)
  mfgData += (char)0xFF; // Dummy manufacturer ID (high byte)
  mfgData += weight.c_str(); // Weight data
  adData.setManufacturerData(mfgData);
  
  pAdvertising->setAdvertisementData(adData);
  pAdvertising->start();
  Serial.println(" BLE advertising started with weight: " + weight);
}

String getWeightReading() {
  if (scale.is_ready()) {
    long reading = scale.get_units(5); // Take average of 5 readings
    return String(reading) + "g";
  } else {
    Serial.println(" Scale not ready");
    return "ERR";
  }
}

void stopBLE() {
  if (pAdvertising) {
    pAdvertising->stop();
  }
  if (pServer) {
    pServer->getAdvertising()->stop();
  }
  BLEDevice::deinit(false);
}

void setup() {
  Serial.begin(115200);
  Serial.println(" Smart Pot Slave Starting...");

  // Load pot configuration
  prefs.begin("potdata", true);
  potName = prefs.getString("name", "SmartPot_01");
  prefs.end();
  Serial.println(" Pot Name: " + potName);

  // Initialize hardware
  pinMode(TILT_PIN, INPUT_PULLDOWN);
  scale.begin(HX711_DOUT, HX711_SCK);
  
  // Wait for scale to stabilize
  Serial.println(" Initializing scale...");
  while (!scale.is_ready()) {
    delay(100);
  }
  
  scale.set_scale(2280.0f); // Calibration factor - adjust as needed
  scale.tare();
  Serial.println(" Scale initialized and tared");

  // Handle boot logic
  if (firstBoot) {
    bootTime = millis();
    firstBoot = false;
    Serial.println(" First boot - staying active for 30 minutes");
  } else {
    Serial.println(" Wake from deep sleep");
    
    // Check wake up cause
    esp_sleep_wakeup_cause_t wakeup_reason = esp_sleep_get_wakeup_cause();
    
    switch(wakeup_reason) {
      case ESP_SLEEP_WAKEUP_GPIO:
        Serial.println(" Woke up from tilt sensor");
        break;
      case ESP_SLEEP_WAKEUP_TIMER:
        Serial.println(" Woke up from timer");
        break;
      default:
        Serial.println(" Unknown wake up reason");
        break;
    }
  }
}

void loop() {
  unsigned long currentTime = millis();
  unsigned long elapsedSinceBoot = currentTime - bootTime;
  
  // Check if we're still in the initial 30-minute active window
  if (elapsedSinceBoot < INIT_WAKE_TIME_MS) {
    Serial.printf("⏳ Initial active window: %lu minutes remaining\n", 
                  (INIT_WAKE_TIME_MS - elapsedSinceBoot) / 60000);
  }
  
  // Get weight reading
  String weight = getWeightReading();
  Serial.println("📊 Current weight: " + weight);
  
  // Start BLE advertising with weight data
  startBLEAdvertising(weight);
  
  // Stay active for the defined time
  unsigned long activeStart = millis();
  while (millis() - activeStart < ACTIVE_TIME_MS) {
    // Check for tilt during active period
    if (digitalRead(TILT_PIN) == HIGH) {
      Serial.println("🎯 Tilt detected during active period");
      // Update weight reading
      weight = getWeightReading();
      Serial.println("📊 Updated weight: " + weight);
      
      // Restart advertising with new weight
      stopBLE();
      delay(100);
      startBLEAdvertising(weight);
    }
    delay(1000);
  }
  
  // Stop BLE before sleeping
  stopBLE();
  Serial.println("📡 BLE stopped");
  
  // If we've passed the initial 30-minute window, enable tilt wake
  if (elapsedSinceBoot >= INIT_WAKE_TIME_MS) {
    Serial.println("🛌 Enabling tilt wake mode");
    // ESP32-C3 uses different GPIO wakeup - use digital pin wakeup
    esp_sleep_enable_gpio_wakeup();
    gpio_wakeup_enable(GPIO_NUM_6, GPIO_INTR_HIGH_LEVEL);
  } else {
    Serial.println("🛌 Still in initial window, setting timer wake");
    // Set timer wake for remaining time in initial window
    unsigned long remainingTime = INIT_WAKE_TIME_MS - elapsedSinceBoot;
    esp_sleep_enable_timer_wakeup(min(remainingTime, (unsigned long)ACTIVE_TIME_MS) * 1000);
  }
  
  Serial.println("😴 Going to deep sleep...");
  delay(100); // Allow serial to complete
  esp_deep_sleep_start();
}