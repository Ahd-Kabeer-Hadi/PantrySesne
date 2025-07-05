import { BleManager, Device } from "react-native-ble-plx";

// WiFi Provisioning Service UUIDs (matches firmware/mother)
export const PROVISIONING_SERVICE_UUID = "12340000-1234-1234-1234-123456789abc";
export const SSID_CHAR_UUID = "12340001-1234-1234-1234-123456789abc";
export const PASS_CHAR_UUID = "12340002-1234-1234-1234-123456789abc";

// Smart Pot Service UUID (matches firmware/node)
export const SMARTPOT_SERVICE_UUID = "12345678-1234-5678-9abc-123456789abc";

// BLE Manager singleton
let manager: BleManager | null = null;
export function initManager() {
  if (!manager) {
    console.log('🔧 BLE Service: Initializing BLE manager');
    manager = new BleManager();
  }
  return manager;
}

export function destroyManager() {
  if (manager) {
    console.log('🔧 BLE Service: Destroying BLE manager');
    manager.destroy();
    manager = null;
  }
}

// Scan for WiFi provisioning devices (SmartPotMaster)
export function scanForProvisioningDevices(
  onDevice: (device: Device) => void, 
  onError: (err: string) => void, 
  onDone: () => void
) {
  console.log('🔧 BLE Service: Starting scan for provisioning devices...');
  const mgr = initManager();
  const discovered: { [id: string]: boolean } = {};
  
  const subscription = mgr.startDeviceScan(
    [PROVISIONING_SERVICE_UUID],
    null,
    (error, device) => {
      if (error) {
        console.log('🔧 BLE Service: Provisioning scan error:', error.message);
        onError(error.message);
        (subscription as any)?.remove?.();
        (subscription as any)?.stop?.();
        onDone();
        return;
      }
      if (device && !discovered[device.id]) {
        console.log('🔧 BLE Service: Found provisioning device:', device.name || device.localName);
        discovered[device.id] = true;
        onDevice(device);
      }
    }
  );
  
  // Stop scan after 8 seconds
  setTimeout(() => {
    console.log('🔧 BLE Service: Stopping provisioning scan after timeout');
    (subscription as any)?.remove?.();
    (subscription as any)?.stop?.();
    onDone();
  }, 8000);
  
  return subscription;
}

// Scan for Smart Pot devices (SmartPot_01, SmartPot_02, etc.)
export function scanForSmartPots(
  onDevice: (device: Device) => void, 
  onError: (err: string) => void, 
  onDone: () => void
) {
  console.log('🔧 BLE Service: Starting scan for Smart Pots...');
  const mgr = initManager();
  const discovered: { [id: string]: boolean } = {};
  
  const subscription = mgr.startDeviceScan(
    null, // Scan all devices, filter by name
    null,
    (error, device) => {
      if (error) {
        console.log('🔧 BLE Service: Smart Pot scan error:', error.message);
        onError(error.message);
        (subscription as any)?.remove?.();
        (subscription as any)?.stop?.();
        onDone();
        return;
      }
      
      // Filter for SmartPot devices (matches firmware naming)
      const deviceName = device?.name || device?.localName || '';
      if (device && deviceName.includes('SmartPot') && !discovered[device.id]) {
        console.log('🔧 BLE Service: Found Smart Pot:', deviceName, 'RSSI:', device.rssi);
        discovered[device.id] = true;
        onDevice(device);
      }
    }
  );
  
  // Stop scan after 8 seconds
  setTimeout(() => {
    console.log('🔧 BLE Service: Stopping Smart Pot scan after timeout');
    (subscription as any)?.remove?.();
    (subscription as any)?.stop?.();
    onDone();
  }, 8000);
  
  return subscription;
}

// Connect to a device
export async function connectToDevice(deviceId: string) {
  console.log('🔧 BLE Service: Connecting to device:', deviceId);
  const mgr = initManager();
  
  try {
    const device = await mgr.connectToDevice(deviceId, { autoConnect: false });
    console.log('🔧 BLE Service: Connected to device, discovering services...');
    await device.discoverAllServicesAndCharacteristics();
    console.log('🔧 BLE Service: Services discovered successfully');
    return device;
  } catch (error) {
    console.log('🔧 BLE Service: Connection failed:', error);
    throw error;
  }
}

// Provision WiFi credentials to device (for SmartPotMaster)
export async function provisionWiFi(device: Device, ssid: string, password: string) {
  console.log('🔧 BLE Service: Provisioning WiFi - SSID:', ssid);
  
  try {
    // Write SSID first
    console.log('🔧 BLE Service: Writing SSID characteristic...');
    await device.writeCharacteristicWithResponseForService(
      PROVISIONING_SERVICE_UUID,
      SSID_CHAR_UUID,
      Buffer.from(ssid, "utf8").toString("base64")
    );
    
    // Write password second
    console.log('🔧 BLE Service: Writing password characteristic...');
    await device.writeCharacteristicWithResponseForService(
      PROVISIONING_SERVICE_UUID,
      PASS_CHAR_UUID,
      Buffer.from(password, "utf8").toString("base64")
    );
    
    console.log('🔧 BLE Service: WiFi provisioning completed successfully');
    return true;
  } catch (error) {
    console.log('🔧 BLE Service: WiFi provisioning failed:', error);
    throw error;
  }
}

// Read weight data from Smart Pot
export async function readWeightData(device: Device) {
  console.log('🔧 BLE Service: Reading weight data from Smart Pot...');
  
  try {
    const characteristic = await device.readCharacteristicForService(
      SMARTPOT_SERVICE_UUID,
      "87654321-4321-8765-cba9-987654321abc"
    );
    
    const weight = characteristic.value;
    console.log('🔧 BLE Service: Weight data read:', weight);
    return weight;
  } catch (error) {
    console.log('🔧 BLE Service: Failed to read weight data:', error);
    throw error;
  }
}

// Disconnect
export async function disconnectDevice(device: Device) {
  console.log('🔧 BLE Service: Disconnecting device');
  try {
    await device.cancelConnection();
    console.log('🔧 BLE Service: Device disconnected successfully');
  } catch (error) {
    console.log('🔧 BLE Service: Disconnect error (non-critical):', error);
  }
} 