// ==================== MASTER (ESP32-C3) - FIXED ====================
// Wi-Fi provisioning via BLE, scan BLE Smart Pots, upload to Firebase

#include <Arduino.h>
#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEScan.h>
#include <HTTPClient.h>
#include <Preferences.h>
#include <ArduinoJson.h>

// WiFi Provisioning Service UUIDs
const char* PROVISIONING_SERVICE_UUID = "12340000-1234-1234-1234-123456789abc";
const char* SSID_CHAR_UUID = "12340001-1234-1234-1234-123456789abc";
const char* PASS_CHAR_UUID = "12340002-1234-1234-1234-123456789abc";

// Smart Pot Service UUID (must match slave)
const char* SMARTPOT_SERVICE_UUID = "12345678-1234-5678-9abc-123456789abc";

// Firebase configuration
const char* FIREBASE_URL = "https://your-project-default-rtdb.firebaseio.com";
const char* FIREBASE_SECRET = "your-database-secret"; // Optional for public writes

Preferences prefs;
BLEServer *pServer = nullptr;
BLECharacteristic *ssidChar = nullptr;
BLECharacteristic *passChar = nullptr;
BLEScan* pBLEScan = nullptr;

String ssid = "";
String password = "";
bool wifiReady = false;
bool provisioningMode = false;

// Structure to store pot data
struct PotData {
  String id;
  String weight;
  unsigned long lastSeen;
};

std::vector<PotData> discoveredPots;

void saveCredentials(String ssid, String pass) {
  prefs.begin("wifi", false);
  prefs.putString("ssid", ssid);
  prefs.putString("pass", pass);
  prefs.end();
  Serial.println("✅ WiFi credentials saved");
}

bool loadCredentials() {
  prefs.begin("wifi", true);
  ssid = prefs.getString("ssid", "");
  password = prefs.getString("pass", "");
  prefs.end();
  
  if (ssid.length() > 0 && password.length() > 0) {
    Serial.println("📱 WiFi credentials loaded from memory");
    return true;
  }
  return false;
}

class WiFiProvisioningCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override {
    String value = pCharacteristic->getValue().c_str();
    
    if (pCharacteristic == ssidChar) {
      ssid = value;
      Serial.println("📝 SSID received: " + ssid);
    } else if (pCharacteristic == passChar) {
      password = value;
      Serial.println("📝 Password received");
    }

    if (ssid.length() > 0 && password.length() > 0) {
      saveCredentials(ssid, password);
      Serial.println("🔄 Restarting to connect to WiFi...");
      delay(1000);
      ESP.restart();
    }
  }
};

void setupWiFiProvisioning() {
  Serial.println("🔧 Setting up WiFi provisioning via BLE...");
  
  BLEDevice::init("SmartPotMaster");
  pServer = BLEDevice::createServer();
  
  BLEService *service = pServer->createService(PROVISIONING_SERVICE_UUID);
  
  ssidChar = service->createCharacteristic(
    SSID_CHAR_UUID, 
    BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR
  );
  
  passChar = service->createCharacteristic(
    PASS_CHAR_UUID, 
    BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR
  );
  
  ssidChar->setCallbacks(new WiFiProvisioningCallbacks());
  passChar->setCallbacks(new WiFiProvisioningCallbacks());
  
  service->start();
  
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(PROVISIONING_SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  pAdvertising->start();
  
  Serial.println("📡 BLE provisioning service started");
  Serial.println("💡 Use BLE app to send WiFi credentials");
  provisioningMode = true;
}

bool connectToWiFi() {
  Serial.println("📶 Connecting to WiFi: " + ssid);
  WiFi.begin(ssid.c_str(), password.c_str());
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    Serial.print(".");
    delay(500);
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi connected!");
    Serial.println("🌐 IP address: " + WiFi.localIP().toString());
    return true;
  } else {
    Serial.println();
    Serial.println("❌ WiFi connection failed");
    return false;
  }
}

void sendToFirebase(String potId, String weight) {
  if (!wifiReady) return;
  
  HTTPClient http;
  String url = String(FIREBASE_URL) + "/smartpots/" + potId + ".json";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  DynamicJsonDocument doc(1024);
  doc["id"] = potId;
  doc["weight"] = weight;
  doc["timestamp"] = millis();
  doc["status"] = "active";
  
  String payload;
  serializeJson(doc, payload);
  
  Serial.println("📤 Sending to Firebase: " + payload);
  
  int httpResponseCode = http.PUT(payload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("✅ Firebase response: " + String(httpResponseCode));
  } else {
    Serial.println("❌ Firebase error: " + String(httpResponseCode));
  }
  
  http.end();
}

class SmartPotScanCallbacks : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertisedDevice) {
    std::string deviceName = advertisedDevice.getName();
    
    // Check if this is a SmartPot device
    if (deviceName.find("SmartPot") != std::string::npos) {
      String potId = String(deviceName.c_str());
      String weight = "0g"; // Default
      
      // Try to get weight from manufacturer data
      if (advertisedDevice.haveManufacturerData()) {
        std::string mfgData = advertisedDevice.getManufacturerData();
        weight = String(mfgData.c_str());
      }
      
      Serial.println("🍯 Found Smart Pot: " + potId + " | Weight: " + weight);
      
      // Update or add to discovered pots
      bool found = false;
      for (auto &pot : discoveredPots) {
        if (pot.id == potId) {
          pot.weight = weight;
          pot.lastSeen = millis();
          found = true;
          break;
        }
      }
      
      if (!found) {
        PotData newPot;
        newPot.id = potId;
        newPot.weight = weight;
        newPot.lastSeen = millis();
        discoveredPots.push_back(newPot);
        Serial.println("➕ New pot added to tracking list");
      }
      
      // Send to Firebase
      sendToFirebase(potId, weight);
    }
  }
};

void startBLEScanning() {
  Serial.println("🔍 Starting BLE scan for Smart Pots...");
  
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new SmartPotScanCallbacks());
  pBLEScan->setActiveScan(true);
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);
  
  // Start continuous scanning
  pBLEScan->start(0, false);
}

void printDiscoveredPots() {
  Serial.println("\n📋 ===== DISCOVERED SMART POTS =====");
  for (const auto &pot : discoveredPots) {
    unsigned long timeSince = (millis() - pot.lastSeen) / 1000;
    Serial.println("🍯 " + pot.id + " | " + pot.weight + " | Last seen: " + String(timeSince) + "s ago");
  }
  Serial.println("=====================================\n");
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n🚀 Smart Pot Master Starting...");
  
  // Try to load saved WiFi credentials
  if (!loadCredentials()) {
    Serial.println("📱 No WiFi credentials found");
    setupWiFiProvisioning();
    return;
  }
  
  // Try to connect to WiFi
  if (!connectToWiFi()) {
    Serial.println("🔄 WiFi connection failed, starting provisioning...");
    setupWiFiProvisioning();
    return;
  }
  
  wifiReady = true;
  Serial.println("🎯 System ready - starting BLE scanning...");
  startBLEScanning();
}

void loop() {
  if (provisioningMode) {
    // In provisioning mode, just wait for credentials
    delay(1000);
    return;
  }
  
  if (wifiReady) {
    // Check WiFi connection
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("📶 WiFi disconnected, reconnecting...");
      connectToWiFi();
    }
    
    // Print discovered pots every 30 seconds
    static unsigned long lastPrintTime = 0;
    if (millis() - lastPrintTime > 30000) {
      printDiscoveredPots();
      lastPrintTime = millis();
    }
    
    // Clean up old pot entries (remove pots not seen for 5 minutes)
    unsigned long currentTime = millis();
    for (auto it = discoveredPots.begin(); it != discoveredPots.end();) {
      if (currentTime - it->lastSeen > 300000) { // 5 minutes
        Serial.println("🗑️ Removing inactive pot: " + it->id);
        it = discoveredPots.erase(it);
      } else {
        ++it;
      }
    }
  }
  
  delay(1000);
}