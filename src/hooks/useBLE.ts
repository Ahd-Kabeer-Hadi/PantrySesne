import { Device } from 'react-native-ble-plx';
import * as bleService from '../services/ble';
import { useBLEStore } from '../stores/bleStore';

// This hook connects UI to BLE service and global state (Zustand)
export function useBLE() {
  const {
    devices,
    setDevices,
    addDevice,
    connectedDevice,
    setConnectedDevice,
    provisioning,
    setProvisioning,
    error,
    setError,
    persistProvisionedDevice,
    persistLastSSID,
    getPersistedSSID,
  } = useBLEStore();

  // Scan for devices
  const scanForDevices = () => {
    setDevices([]);
    bleService.scanForDevices(
      (device: Device) => {
        addDevice({ id: device.id, name: device.name || device.localName || device.id, device });
      },
      (err: string) => setError(err),
      () => {}
    );
  };

  // Connect to device
  const connectToDevice = async (id: string) => {
    try {
      const device = await bleService.connectToDevice(id);
      setConnectedDevice(device);
      return device;
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  // Provision device
  const provisionDevice = async (ssid: string, password: string) => {
    if (!connectedDevice) {
      setError('No device connected');
      setProvisioning('error');
      return false;
    }
    setProvisioning('pending');
    setError(null);
    try {
      await bleService.provisionDevice(connectedDevice, ssid, password);
      setProvisioning('success');
      persistProvisionedDevice({ id: connectedDevice.id, name: connectedDevice.name || connectedDevice.id });
      persistLastSSID(ssid);
      return true;
    } catch (e: any) {
      setError(e.message);
      setProvisioning('error');
      return false;
    }
  };

  // Disconnect
  const disconnect = async () => {
    if (connectedDevice) {
      await bleService.disconnectDevice(connectedDevice);
      setConnectedDevice(null);
    }
  };

  // iOS: Add logic for MTU, delays, or background support as needed

  return {
    devices,
    scanForDevices,
    connectToDevice,
    connectedDevice,
    provisionDevice,
    provisioning,
    disconnect,
    error,
    setError,
    getPersistedSSID,
  };
} 