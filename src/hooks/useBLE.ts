// hooks/useBLE.ts
import { useEffect, useRef, useState } from 'react';
import { BleManager, Device, State, Subscription } from 'react-native-ble-plx';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useBLEStore } from '../stores/bleStore'; // Optional global state (Zustand)
import { getLastScanTime, setLastScanTime } from '../lib/mmkvUtils';

export interface BLEDevice {
  id: string;
  name: string;
  rssi: number;
  isConnectable: boolean;
  raw: Device;
}

const TARGET_NAMES = ['SmartPot', 'SmartPot Master', 'PantrySense'];

function isTargetDevice(name: string | null | undefined): boolean {
  if (!name) return false;
  return TARGET_NAMES.some((tag) => name.includes(tag));
}

// Singleton BLEManager
let bleManagerInstance: BleManager | null = null;

function getBLEManager(): BleManager {
  if (!bleManagerInstance) {
    bleManagerInstance = new BleManager();
  }
  return bleManagerInstance;
}

// Adaptive cooldown: 3s if no devices found, 15s if devices found
const SHORT_COOLDOWN_MS = 3000;
const LONG_COOLDOWN_MS = 15000;
let lastCooldownMs = SHORT_COOLDOWN_MS;

export function useBLE() {
  const manager = getBLEManager();
  const [isReady, setIsReady] = useState(false);
  const bleStateSub = useRef<Subscription | null>(null);
  const scanTimer = useRef<NodeJS.Timeout | null>(null);
  const knownIds = useRef<Set<string>>(new Set());

  // 🧠 Global Zustand Store
  const {
    devices,
    setDevices,
    isScanning,
    setIsScanning,
    selectedDevice,
    setSelectedDevice,
  } = useBLEStore(); // acts as single source of truth

  // 📱 Platform permission
  // Remove requestPermissions function

  // 🔄 BLE lifecycle monitor
  useEffect(() => {
    bleStateSub.current = manager.onStateChange((newState: State) => {
      console.log('🧠 BLE State:', newState);
      setIsReady(newState === 'PoweredOn');
    }, true);

    return () => {
      bleStateSub.current?.remove();
      scanTimer.current && clearTimeout(scanTimer.current);
    };
  }, []);

  const startScan = async (): Promise<void> => {
    if (isScanning || !isReady) return;

    // MMKV: Debounce scan if recently scanned
    const lastScan = getLastScanTime();
    const now = Date.now();
    if (lastScan && now - lastScan < lastCooldownMs) {
      console.log('⏳ Scan skipped: cooldown active');
      return;
    }

    console.log('🔍 Starting BLE Scan...');
    knownIds.current.clear();
    setDevices([]);
    setIsScanning(true);

    manager.startDeviceScan(null, { allowDuplicates: false }, (error, scannedDevice) => {
      if (error) {
        console.error('❌ BLE Scan Error:', error);
        stopScan();
        return;
      }

      if (
        scannedDevice &&
        scannedDevice.name &&
        isTargetDevice(scannedDevice.name) &&
        !knownIds.current.has(scannedDevice.id)
      ) {
        knownIds.current.add(scannedDevice.id);
        setDevices((prev: BLEDevice[]) => {
          if (prev.some((d) => d.id === scannedDevice.id)) return prev;
          return [
            ...prev,
            {
              id: scannedDevice.id,
              name: scannedDevice.name,
              rssi: scannedDevice.rssi ?? -100,
              isConnectable: scannedDevice.isConnectable ?? true,
              raw: scannedDevice,
            },
          ];
        });
      }
    });
    // Timeout scan after 8 seconds
    scanTimer.current = setTimeout(() => {
      console.log('⏱️ Scan timeout');
      stopScan();
      setIsScanning(false);
      // Adaptive cooldown: 3s if no devices found, 15s if devices found
      const currentDevices = useBLEStore.getState().devices;
      if (currentDevices.length === 0) {
        lastCooldownMs = SHORT_COOLDOWN_MS;
      } else {
        lastCooldownMs = LONG_COOLDOWN_MS;
      }
      setLastScanTime(Date.now()); // MMKV: Record scan time after scan completes
    }, 8000) as unknown as NodeJS.Timeout;
  };

  const stopScan = (): void => {
    manager.stopDeviceScan();
    if (isScanning) setIsScanning(false);
    scanTimer.current && clearTimeout(scanTimer.current);
    scanTimer.current = null;
  };

  /**
   * Attempts to connect to a BLE device with polling/throttle and timeout.
   * @param deviceId The BLE device ID
   * @param timeoutMs Max time to keep retrying (default 30s)
   * @param intervalMs Time between attempts (default 2500ms)
   * @returns Device if connected, or null
   */
  const connectToDevice = async (
    deviceId: string,
    timeoutMs = 30000,
    intervalMs = 2500
  ): Promise<Device | null> => {
    if (!deviceId) return null;
    const start = Date.now();
    let lastError = null;
    let attempt = 1;
    while (Date.now() - start < timeoutMs) {
      try {
        stopScan();
        // Let BLE stack settle
        await new Promise(res => setTimeout(res, 300));
        console.log(`🔗 [Attempt ${attempt}] Connecting to device ${deviceId}...`);
        const device = await manager.connectToDevice(deviceId, { timeout: 8000 });
        await device.discoverAllServicesAndCharacteristics();
        setSelectedDevice(device);
        console.log(`✅ [Attempt ${attempt}] Connected to device ${deviceId}`);
        return device;
      } catch (error) {
        lastError = error;
        const errorMsg = error?.message || error?.toString();
        console.log(`❌ [Attempt ${attempt}] Connection error:`, errorMsg, error);
        // Only retry if the error is a disconnection error
        if (errorMsg && errorMsg.includes('was disconnected')) {
          if (Date.now() - start + intervalMs > timeoutMs) break; // Don't overshoot timeout
          console.log(`🔁 Retrying connection to device ${deviceId} after ${intervalMs}ms...`);
          await new Promise(res => setTimeout(res, intervalMs));
          attempt++;
          continue;
        } else {
          // For other errors, do not retry
          break;
        }
      }
    }
    console.error(`❌ All connection attempts failed for device ${deviceId}`, lastError);
    return null;
  };

  const disconnectDevice = async (deviceId?: string): Promise<void> => {
    try {
      if (!deviceId && selectedDevice) {
        await manager.cancelDeviceConnection(selectedDevice.id);
      } else if (deviceId) {
        await manager.cancelDeviceConnection(deviceId);
      }
      setSelectedDevice(null);
    } catch (err) {
      console.warn('⚠️ Disconnect error:', err);
    }
  };

  return {
    isReady,
    isScanning,
    devices,
    selectedDevice,
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice,
  };
}
