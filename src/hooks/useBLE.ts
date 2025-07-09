import { useState, useEffect, useCallback } from "react";
import { BleManager, Device, State } from "react-native-ble-plx";
import * as bleService from '../services/ble';
import { useBLEStore } from '../stores/bleStore';
import { parseError, AppError } from '../utils/errorHandler';
import { useBLEPermissions } from './useBLEPermissions';
import type { ProvisioningDevice, SmartPot } from '../stores/bleStore';

// BLE Service and Characteristic UUIDs for SmartPot Master
const SMART_POT_MASTER_SERVICE = "12340000-1234-1234-1234-123456789abc";
const WIFI_SSID_CHARACTERISTIC = "12340001-1234-1234-1234-123456789abc";
const WIFI_PASSWORD_CHARACTERISTIC = "12340002-1234-1234-1234-123456789abc";
const WIFI_STATUS_CHARACTERISTIC = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

// BLE Service and Characteristic UUIDs for Smart Pots
const SMART_POT_SERVICE = "22222222-3333-4444-5555-666666666666";
const WEIGHT_CHARACTERISTIC = "33333333-4444-5555-6666-777777777777";
const BATTERY_CHARACTERISTIC = "44444444-5555-6666-7777-888888888888";

// This hook connects UI to BLE service and global state (Zustand)
export function useBLE() {
  const {
    // Provisioning devices
    provisioningDevices,
    setProvisioningDevices,
    addProvisioningDevice,
    connectedProvisioningDevice,
    setConnectedProvisioningDevice,
    
    // Smart Pots
    smartPots,
    setSmartPots,
    addSmartPot,
    updateSmartPotWeight,
    connectedSmartPot,
    setConnectedSmartPot,
    
    // WiFi provisioning
    provisioning,
    setProvisioning,
    
    error,
    setError,
    persistProvisionedDevice,
    persistLastSSID,
    getPersistedSSID,
  } = useBLEStore();

  const [manager] = useState(() => new BleManager());
  const [state, setState] = useState<State>(State.Unknown);
  const [scanning, setScanning] = useState(false);
  
  const {
    isReady,
    requestPermissions,
    error: permissionError,
  } = useBLEPermissions();

  // ===== PROVISIONING DEVICES (SmartPot Master) =====
  
  // Scan for WiFi provisioning devices
  const scanForProvisioningDevices = async () => {
    console.log('🔍 BLE: Starting provisioning device scan, checking permissions...');
    console.log('🔍 BLE: isReady:', isReady);
    
    // Check permissions first
    if (!isReady) {
      console.log('🔍 BLE: Permissions not ready, requesting...');
      const permissionsGranted = await requestPermissions();
      console.log('🔍 BLE: Permissions granted:', permissionsGranted);
      
      if (!permissionsGranted) {
        console.log('🔍 BLE: Permissions denied, stopping scan');
        const appError = parseError('Permissions not granted');
        setError(appError.userMessage);
        return;
      }
    }

    console.log('🔍 BLE: Permissions OK, starting provisioning device scan...');
    setProvisioningDevices([]);
    setError(null);
    
    bleService.scanForProvisioningDevices(
      (device: Device) => {
        if ((device.name || device.localName) === 'SmartPot Master') {
          const currentDevices = useBLEStore.getState().provisioningDevices;
          if (!currentDevices.some(d => d.id === device.id)) {
            setProvisioningDevices([...currentDevices, { 
              id: device.id, 
              name: device.name || device.localName || device.id, 
              device 
            }]);
          }
        }
      },
      (err: string) => {
        console.log('🔍 BLE: Provisioning scan error:', err);
        const appError = parseError(err);
        setError(appError.userMessage);
      },
      () => {
        console.log('🔍 BLE: Provisioning scan completed');
      }
    );
  };

  // Connect to provisioning device
  const connectToProvisioningDevice = async (id: string, maxRetries = 3, retryDelay = 1200) => {
    console.log('🔗 BLE: Connecting to provisioning device:', id);
    let lastError = null;
    // Stop any ongoing scan before connecting
    try {
      const manager = bleService.initManager();
      manager.stopDeviceScan && manager.stopDeviceScan();
    } catch (e) {
      console.log('🔗 BLE: Error stopping scan before connect:', e);
    }
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Destroy and re-init BLEManager before each attempt
        bleService.destroyManager();
        bleService.initManager();
        const device = await bleService.connectToDevice(id);
        console.log('🔗 BLE: Connected to provisioning device successfully');
        setConnectedProvisioningDevice(device); // <-- update global state
        setProvisioning('pending');
        return device;
      } catch (e: any) {
        lastError = e;
        console.log(`🔗 BLE: Provisioning device connection failed (attempt ${attempt}):`, e.message);
        if (attempt < maxRetries) {
          await new Promise(res => setTimeout(res, retryDelay));
        }
      }
    }
    // All attempts failed
    const errorMsg = lastError?.message || 'Unknown connection error';
    const appError = parseError(errorMsg);
    setError(appError.userMessage || 'Failed to connect to device. Please try again.');
    setProvisioning('idle');
    setConnectedProvisioningDevice(null); // <-- clear on failure
    return null;
  };

  // Provision WiFi to device
  const provisionWiFi = async (ssid: string, password: string) => {
    console.log('📡 BLE: Provisioning WiFi to device - SSID:', ssid);
    if (!connectedProvisioningDevice) { // <-- use connected device
      console.log('📡 BLE: No provisioning device connected');
      const appError = parseError('No device connected');
      setError(appError.userMessage);
      setProvisioning('idle');
      return false;
    }
    setProvisioning('pending');
    setError(null);
    try {
      await bleService.provisionWiFi(connectedProvisioningDevice, ssid, password); // <-- use connected device
      console.log('📡 BLE: WiFi provisioning successful');
      setProvisioning('success');
      addSmartPot({ 
        id: connectedProvisioningDevice.id, 
        name: connectedProvisioningDevice.name || connectedProvisioningDevice.id,
        weight: '0g',
        device: connectedProvisioningDevice,
        lastSeen: Date.now()
      });
      return true;
    } catch (e: any) {
      console.log('📡 BLE: WiFi provisioning failed:', e.message);
      const appError = parseError(e.message);
      setError(appError.userMessage);
      setProvisioning('error');
      return false;
    }
  };

  // ===== SMART POTS (SmartPot_01, SmartPot_02, etc.) =====
  
  // Scan for Smart Pots
  const scanForSmartPots = async () => {
    console.log('🔍 BLE: Starting Smart Pot scan, checking permissions...');
    
    // Check permissions first
    if (!isReady) {
      console.log('🔍 BLE: Permissions not ready, requesting...');
      const permissionsGranted = await requestPermissions();
      console.log('🔍 BLE: Permissions granted:', permissionsGranted);
      
      if (!permissionsGranted) {
        console.log('🔍 BLE: Permissions denied, stopping scan');
        const appError = parseError('Permissions not granted');
        setError(appError.userMessage);
        return;
      }
    }

    console.log('🔍 BLE: Permissions OK, starting Smart Pot scan...');
    setSmartPots([]);
    setError(null);
    
    bleService.scanForSmartPots(
      (device: Device) => {
        console.log('🔍 BLE: Found Smart Pot:', device.name || device.id);
        const currentPots = useBLEStore.getState().smartPots;
        setSmartPots([...currentPots, { 
          id: device.id, 
          name: device.name || device.localName || device.id,
          weight: '0g',
          device,
          lastSeen: Date.now()
        }]);
      },
      (err: string) => {
        console.log('🔍 BLE: Smart Pot scan error:', err);
        const appError = parseError(err);
        setError(appError.userMessage);
      },
      () => {
        console.log('🔍 BLE: Smart Pot scan completed');
      }
    );
  };

  // Connect to Smart Pot
  const connectToSmartPot = async (id: string) => {
    console.log('🔗 BLE: Connecting to Smart Pot:', id);
    try {
      const device = await bleService.connectToDevice(id);
      console.log('🔗 BLE: Connected to Smart Pot successfully');
      setConnectedSmartPot(device); // <-- set to Device
      return device;
    } catch (e: any) {
      console.log('🔗 BLE: Smart Pot connection failed:', e.message);
      const appError = parseError(e.message);
      setError(appError.userMessage);
      setConnectedSmartPot(null); // <-- set to null
      return null;
    }
  };

  // Read weight from Smart Pot
  const readWeightFromSmartPot = async () => {
    console.log('📊 BLE: Reading weight from Smart Pot');
    if (smartPots.length === 0) {
      console.log('📊 BLE: No Smart Pot connected');
      const appError = parseError('No Smart Pot connected');
      setError(appError.userMessage);
      return null;
    }
    try {
      const weight = await bleService.readWeightData(smartPots[0].device);
      console.log('📊 BLE: Weight read successfully:', weight);
      if (weight) {
        const updatedPots = smartPots.map(device =>
          device.id === smartPots[0].id ? { ...device, weight: weight } : device
        );
        setSmartPots(updatedPots);
      }
      return weight;
    } catch (e: any) {
      console.log('📊 BLE: Weight reading failed:', e.message);
      const appError = parseError(e.message);
      setError(appError.userMessage);
      return null;
    }
  };

  // ===== GENERAL FUNCTIONS =====
  
  // Disconnect
  const disconnect = async () => {
    if (connectedProvisioningDevice) {
      console.log('🔌 BLE: Disconnecting provisioning device');
      try {
        await bleService.disconnectDevice(connectedProvisioningDevice);
        console.log('🔌 BLE: Provisioning device disconnected successfully');
      } catch (e: any) {
        console.log('🔌 BLE: Provisioning device disconnect error (non-critical):', e.message);
      } finally {
        setConnectedProvisioningDevice(null); // <-- clear on disconnect
      }
    }
    if (smartPots.length > 0) {
      console.log('🔌 BLE: Disconnecting Smart Pot');
      try {
        await bleService.disconnectDevice(smartPots[0].device);
        console.log('🔌 BLE: Smart Pot disconnected successfully');
      } catch (e: any) {
        console.log('🔌 BLE: Smart Pot disconnect error (non-critical):', e.message);
      } finally {
        setSmartPots([]);
      }
    }
  };

  // Get parsed error for UI display
  const getParsedError = (): AppError | null => {
    if (!error) return null;
    return parseError(error);
  };

  return {
    // Provisioning devices
    provisioningDevices,
    scanForProvisioningDevices,
    connectToProvisioningDevice,
    connectedProvisioningDevice,
    provisionWiFi,
    
    // Smart Pots
    smartPots,
    scanForSmartPots,
    connectToSmartPot,
    connectedSmartPot,
    readWeightFromSmartPot,
    
    // WiFi provisioning
    provisioning,
    
    // General
    disconnect,
    error,
    setError,
    getParsedError,
    isReady,
    requestPermissions,
  };
} 