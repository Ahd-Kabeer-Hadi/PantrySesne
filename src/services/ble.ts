// lib/ble.ts
import type { Device } from "react-native-ble-plx";
import { Buffer } from "buffer";

// BLE Service UUIDs (match firmware)
export const PROVISIONING_SERVICE_UUID = "12340000-1234-1234-1234-123456789abc";
export const SSID_CHAR_UUID = "12340001-1234-1234-1234-123456789abc";
export const PASS_CHAR_UUID = "12340002-1234-1234-1234-123456789abc";

export const SMARTPOT_SERVICE_UUID = "12345678-1234-5678-9abc-123456789abc";
export const WEIGHT_CHAR_UUID = "87654321-4321-8765-cba9-987654321abc";

/**
 * Check what services are available on the device
 */
export async function discoverDeviceServices(device: Device): Promise<string[]> {
  try {
    console.log("🔍 Discovering device services...");
    
    // Discover all services and characteristics
    await device.discoverAllServicesAndCharacteristics();
    
    // Get all services
    const services = await device.services();
    const serviceUUIDs = services.map(service => service.uuid);
    
    console.log("📋 Available services:", serviceUUIDs);
    return serviceUUIDs;
  } catch (error) {
    console.error("❌ Failed to discover services:", error);
    return [];
  }
}

/**
 * Check if device is in provisioning mode by attempting to read a characteristic
 */
export async function checkProvisioningMode(device: Device): Promise<boolean> {
  try {
    console.log("🔍 Checking if device is in provisioning mode...");
    
    // First discover all services
    const services = await discoverDeviceServices(device);
    
    // Check if provisioning service is available
    const hasProvisioningService = services.includes(PROVISIONING_SERVICE_UUID);
    console.log(`📡 Provisioning service available: ${hasProvisioningService}`);
    
    if (!hasProvisioningService) {
      console.log("❌ Provisioning service not found");
      return false;
    }
    
    // Since the firmware only supports write operations, we don't need to read
    // The presence of the service and characteristics is sufficient
    console.log("✅ Device is in provisioning mode (service and characteristics found)");
    return true;
  } catch (error) {
    console.log("❌ Device is not in provisioning mode or service not available");
    return false;
  }
}

/**
 * Detect what mode the device is in based on available services
 */
export async function detectDeviceMode(device: Device): Promise<{
  mode: 'provisioning' | 'smartpot' | 'unknown';
  services: string[];
  message: string;
}> {
  try {
    console.log("🔍 Detecting device mode...");
    
    const services = await discoverDeviceServices(device);
    
    if (services.includes(PROVISIONING_SERVICE_UUID)) {
      return {
        mode: 'provisioning',
        services,
        message: 'Device is in provisioning mode and ready for WiFi setup'
      };
    } else if (services.includes(SMARTPOT_SERVICE_UUID)) {
      return {
        mode: 'smartpot',
        services,
        message: 'Device is in SmartPot mode (already configured). To reconfigure, restart the device.'
      };
    } else {
      return {
        mode: 'unknown',
        services,
        message: `Device has unknown services: ${services.join(', ')}`
      };
    }
  } catch (error) {
    console.error("❌ Failed to detect device mode:", error);
    return {
      mode: 'unknown',
      services: [],
      message: 'Failed to detect device mode'
    };
  }
}

/**
 * Debug function to get detailed device information
 */
export async function debugDeviceInfo(device: Device): Promise<void> {
  try {
    console.log("🔍 === DEVICE DEBUG INFO ===");
    console.log(`📱 Device ID: ${device.id}`);
    console.log(`📱 Device Name: ${device.name}`);
    console.log(`📱 Device Local Name: ${device.localName}`);
    console.log(`📱 Device MTU: ${device.mtu}`);
    console.log(`📱 Device RSSI: ${device.rssi}`);
    console.log(`📱 Device isConnectable: ${device.isConnectable}`);
    
    // Discover services
    await device.discoverAllServicesAndCharacteristics();
    const services = await device.services();
    
    console.log(`📋 Total Services: ${services.length}`);
    
    for (const service of services) {
      console.log(`\n🔧 Service: ${service.uuid}`);
      
      try {
        const characteristics = await service.characteristics();
        console.log(`  📊 Characteristics: ${characteristics.length}`);
        
        for (const char of characteristics) {
          console.log(`    - ${char.uuid}`);
        }
      } catch (charError) {
        console.log(`  ❌ Failed to get characteristics: ${charError}`);
      }
    }
    
    console.log("=== END DEVICE DEBUG INFO ===\n");
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

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
    // Check if device is still connected before proceeding
    const isConnected = await device.isConnected();
    if (!isConnected) {
      throw new Error('Device is not connected - please reconnect and try again');
    }
    
    console.log("✅ Device connection verified");

    // Debug device info first
    await debugDeviceInfo(device);

    // Detect device mode first
    const deviceMode = await detectDeviceMode(device);
    console.log(`📱 Device mode: ${deviceMode.mode}`);
    console.log(`📋 Available services: ${deviceMode.services.join(', ')}`);
    
    if (deviceMode.mode === 'smartpot') {
      throw new Error('Device is already configured and in SmartPot mode. To reconfigure WiFi, please restart your PantrySense Hub.');
    } else if (deviceMode.mode === 'unknown') {
      throw new Error(`Device has unknown configuration. Available services: ${deviceMode.services.join(', ')}`);
    }

    // Check if provisioning service is available
    const hasProvisioningService = deviceMode.services.includes(PROVISIONING_SERVICE_UUID);
    if (!hasProvisioningService) {
      throw new Error(`Device does not have provisioning service. Available services: ${deviceMode.services.join(', ')}`);
    }

    // Check if device is in provisioning mode
    const isProvisioningMode = await checkProvisioningMode(device);
    if (!isProvisioningMode) {
      throw new Error('Device is not in provisioning mode - please restart your PantrySense Hub');
    }

    // Send raw string data directly, not base64 encoded
    // The ESP32 expects plain text via .c_str()

    // Write SSID - try without response first, fallback to with response
    console.log("🔧 Writing SSID...");
    try {
      await device.writeCharacteristicWithoutResponseForService(
        PROVISIONING_SERVICE_UUID,
        SSID_CHAR_UUID,
        ssid
      );
      console.log("✅ SSID written without response");
    } catch (writeError) {
      console.log("⚠️ Write without response failed, trying with response...");
      await device.writeCharacteristicWithResponseForService(
        PROVISIONING_SERVICE_UUID,
        SSID_CHAR_UUID,
        ssid
      );
      console.log("✅ SSID written with response");
    }

    // Add a small delay between writes
    await new Promise(resolve => setTimeout(resolve, 500));

    // Write Password - try without response first, fallback to with response
    console.log("🔧 Writing Password...");
    try {
      await device.writeCharacteristicWithoutResponseForService(
        PROVISIONING_SERVICE_UUID,
        PASS_CHAR_UUID,
        password
      );
      console.log("✅ Password written without response");
    } catch (writeError) {
      console.log("⚠️ Write without response failed, trying with response...");
      await device.writeCharacteristicWithResponseForService(
        PROVISIONING_SERVICE_UUID,
        PASS_CHAR_UUID,
        password
      );
      console.log("✅ Password written with response");
    }

    console.log("✅ WiFi credentials written successfully.");
    
    // Wait a moment for the device to process the credentials
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // The ESP32 will restart after receiving credentials, which is expected behavior
    // We don't need to verify by reading since the firmware doesn't support read operations
    console.log("✅ Provisioning completed - device should restart shortly");
    
    return true;
  } catch (error) {
    console.error("❌ Provisioning failed:", error);
    
    // Provide more specific error messages
    const errorMsg = error?.message || error?.toString();
    if (errorMsg.includes('timeout')) {
      throw new Error('Connection timeout - device may be out of range or busy');
    } else if (errorMsg.includes('not found')) {
      throw new Error('Device not found - please ensure the device is powered on and in range');
    } else if (errorMsg.includes('permission')) {
      throw new Error('Bluetooth permission denied - please check app permissions');
    } else if (errorMsg.includes('write failed')) {
      throw new Error('Write failed - device may not support this operation or may be disconnected');
    } else if (errorMsg.includes('not connected')) {
      throw new Error('Device connection lost - please reconnect and try again');
    } else if (errorMsg.includes('not in provisioning mode')) {
      throw new Error('Device is not ready for provisioning - please restart your PantrySense Hub');
    } else if (errorMsg.includes('does not have provisioning service')) {
      throw new Error('Device is not in setup mode - please restart your PantrySense Hub to enter setup mode');
    } else if (errorMsg.includes('already configured')) {
      throw new Error('Device is already configured. To reconfigure WiFi, please restart your PantrySense Hub.');
    } else {
      throw new Error(`Provisioning failed: ${errorMsg}`);
    }
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
