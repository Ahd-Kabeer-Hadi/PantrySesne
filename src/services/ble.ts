// lib/ble.ts
import type { Device } from "react-native-ble-plx";

// BLE Service UUIDs (match firmware)
export const PROVISIONING_SERVICE_UUID = "12340000-1234-1234-1234-123456789abc";
export const SSID_CHAR_UUID = "12340001-1234-1234-1234-123456789abc";
export const PASS_CHAR_UUID = "12340002-1234-1234-1234-123456789abc";

export const SMARTPOT_SERVICE_UUID = "12345678-1234-5678-9abc-123456789abc";
export const WEIGHT_CHAR_UUID = "87654321-4321-8765-cba9-987654321abc";

/**
 * Provision WiFi credentials to a SmartPotMaster device via BLE
 */
export async function provisionWiFi(
  device: Device,
  ssid: string,
  password: string
): Promise<boolean> {
  console.log("📡 Provisioning WiFi...");
  try {
    const ssidEncoded = Buffer.from(ssid, "utf8").toString("base64");
    const passEncoded = Buffer.from(password, "utf8").toString("base64");

    // Write SSID
    console.log("🔧 Writing SSID...");
    await device.writeCharacteristicWithResponseForService(
      PROVISIONING_SERVICE_UUID,
      SSID_CHAR_UUID,
      ssidEncoded
    );

    // Write Password
    console.log("🔧 Writing Password...");
    await device.writeCharacteristicWithResponseForService(
      PROVISIONING_SERVICE_UUID,
      PASS_CHAR_UUID,
      passEncoded
    );

    console.log("✅ WiFi credentials written successfully.");
    return true;
  } catch (error) {
    console.error("❌ Provisioning failed:", error);
    throw error;
  }
}

/**
 * Read weight data from a SmartPot
 */
export async function readWeightData(device: Device): Promise<string | null> {
  try {
    console.log("⚖️ Reading SmartPot weight...");
    const characteristic = await device.readCharacteristicForService(
      SMARTPOT_SERVICE_UUID,
      WEIGHT_CHAR_UUID
    );

    if (!characteristic?.value) {
      console.warn("⚠️ No weight value received.");
      return null;
    }

    const decoded = Buffer.from(characteristic.value, "base64").toString("utf8");
    console.log("✅ Weight received:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Failed to read weight:", error);
    return null;
  }
}

/**
 * Gracefully disconnect a BLE device
 */
export async function disconnectDevice(device: Device): Promise<void> {
  try {
    console.log("🔌 Disconnecting from BLE device...");
    await device.cancelConnection();
    console.log("✅ Device disconnected");
  } catch (error) {
    console.warn("⚠️ BLE disconnect failed (non-fatal):", error);
  }
}
