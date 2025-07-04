import { BleManager, Device } from "react-native-ble-plx";
import {
    PASS_CHAR_UUID,
    PROVISIONING_SERVICE_UUID,
    SSID_CHAR_UUID,
} from "./ble";

// BLE Manager singleton
let manager: BleManager | null = null;
export function initManager() {
  if (!manager) manager = new BleManager();
  return manager;
}

export function destroyManager() {
  if (manager) {
    manager.destroy();
    manager = null;
  }
}

// Scan for devices advertising the provisioning service
export function scanForDevices(onDevice: (device: Device) => void, onError: (err: string) => void, onDone: () => void) {
  const mgr = initManager();
  const discovered: { [id: string]: boolean } = {};
  // iOS/Android: service UUID filter works for both
  const subscription = mgr.startDeviceScan(
    [PROVISIONING_SERVICE_UUID],
    null,
    (error, device) => {
      if (error) {
        onError(error.message);
        (subscription as any)?.remove?.();
        (subscription as any)?.stop?.();
        onDone();
        return;
      }
      if (device && (device.name || device.localName) && !discovered[device.id]) {
        discovered[device.id] = true;
        onDevice(device);
      }
    }
  );
  // Stop scan after 8 seconds
  setTimeout(() => {
    (subscription as any)?.remove?.();
    (subscription as any)?.stop?.();
    onDone();
  }, 8000);
  return subscription;
}

// Connect to a device
export async function connectToDevice(deviceId: string) {
  const mgr = initManager();
  const device = await mgr.connectToDevice(deviceId, { autoConnect: false });
  await device.discoverAllServicesAndCharacteristics();
  return device;
}

// Provision device (write SSID and password)
export async function provisionDevice(device: Device, ssid: string, password: string) {
  // iOS: may need to handle MTU or delays between writes
  await device.writeCharacteristicWithResponseForService(
    PROVISIONING_SERVICE_UUID,
    SSID_CHAR_UUID,
    Buffer.from(ssid, "utf8").toString("base64")
  );
  await device.writeCharacteristicWithResponseForService(
    PROVISIONING_SERVICE_UUID,
    PASS_CHAR_UUID,
    Buffer.from(password, "utf8").toString("base64")
  );
  return true;
}

// Disconnect
export async function disconnectDevice(device: Device) {
  try {
    await device.cancelConnection();
  } catch {}
}

// Placeholder for BLE logic (scan, connect, write, etc.) 