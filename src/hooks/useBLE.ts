// hooks/useBLE.ts
import { useEffect, useRef, useState } from 'react';
import { BleManager, Device, State, Subscription } from 'react-native-ble-plx';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useBLEStore } from '../stores/bleStore'; // Optional global state (Zustand)

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

    // Permissions are now handled in the UI. Assume granted here.
    // Removed redundant permission check.

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
      setIsScanning(false)
    }, 8000) as unknown as NodeJS.Timeout;
  };

  const stopScan = (): void => {
    manager.stopDeviceScan();
    if (isScanning) setIsScanning(false);
    scanTimer.current && clearTimeout(scanTimer.current);
    scanTimer.current = null;
  };

  const connectToDevice = async (deviceId: string): Promise<Device | null> => {
    if (!deviceId) return null;

    try {
      stopScan();
      console.log(`🔗 Connecting to device ${deviceId}...`);
      const device = await manager.connectToDevice(deviceId, { timeout: 8000 });
      await device.discoverAllServicesAndCharacteristics();
      setSelectedDevice(device);
      return device;
    } catch (error) {
      console.error('❌ Connection error:', error);
      return null;
    }
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
