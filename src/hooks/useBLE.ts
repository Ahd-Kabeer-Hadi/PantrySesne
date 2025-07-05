import { Device } from 'react-native-ble-plx';
import * as bleService from '../services/ble';
import { useBLEStore } from '../stores/bleStore';
import { parseError, AppError } from '../utils/errorHandler';
import { useBLEPermissions } from './useBLEPermissions';

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

  const {
    isReady,
    requestPermissions,
    error: permissionError,
  } = useBLEPermissions();

  // ===== PROVISIONING DEVICES (SmartPotMaster) =====
  
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
        console.log('🔍 BLE: Found provisioning device:', device.name || device.id);
        addProvisioningDevice({ 
          id: device.id, 
          name: device.name || device.localName || device.id, 
          device 
        });
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
  const connectToProvisioningDevice = async (id: string) => {
    console.log('🔗 BLE: Connecting to provisioning device:', id);
    try {
      const device = await bleService.connectToDevice(id);
      console.log('🔗 BLE: Connected to provisioning device successfully');
      setConnectedProvisioningDevice(device);
      return device;
    } catch (e: any) {
      console.log('🔗 BLE: Provisioning device connection failed:', e.message);
      const appError = parseError(e.message);
      setError(appError.userMessage);
      return null;
    }
  };

  // Provision WiFi to device
  const provisionWiFi = async (ssid: string, password: string) => {
    console.log('📡 BLE: Provisioning WiFi to device - SSID:', ssid);
    if (!connectedProvisioningDevice) {
      console.log('📡 BLE: No provisioning device connected');
      const appError = parseError('No device connected');
      setError(appError.userMessage);
      setProvisioning('error');
      return false;
    }
    setProvisioning('pending');
    setError(null);
    try {
      await bleService.provisionWiFi(connectedProvisioningDevice, ssid, password);
      console.log('📡 BLE: WiFi provisioning successful');
      setProvisioning('success');
      persistProvisionedDevice({ 
        id: connectedProvisioningDevice.id, 
        name: connectedProvisioningDevice.name || connectedProvisioningDevice.id 
      });
      persistLastSSID(ssid);
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
        addSmartPot({ 
          id: device.id, 
          name: device.name || device.localName || device.id,
          weight: '0g', // Default weight
          device,
          lastSeen: Date.now()
        });
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
      setConnectedSmartPot(device);
      return device;
    } catch (e: any) {
      console.log('🔗 BLE: Smart Pot connection failed:', e.message);
      const appError = parseError(e.message);
      setError(appError.userMessage);
      return null;
    }
  };

  // Read weight from Smart Pot
  const readWeightFromSmartPot = async () => {
    console.log('📊 BLE: Reading weight from Smart Pot');
    if (!connectedSmartPot) {
      console.log('📊 BLE: No Smart Pot connected');
      const appError = parseError('No Smart Pot connected');
      setError(appError.userMessage);
      return null;
    }
    try {
      const weight = await bleService.readWeightData(connectedSmartPot);
      console.log('📊 BLE: Weight read successfully:', weight);
      if (weight) {
        updateSmartPotWeight(connectedSmartPot.id, weight);
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
        setConnectedProvisioningDevice(null);
      }
    }
    
    if (connectedSmartPot) {
      console.log('🔌 BLE: Disconnecting Smart Pot');
      try {
        await bleService.disconnectDevice(connectedSmartPot);
        console.log('🔌 BLE: Smart Pot disconnected successfully');
      } catch (e: any) {
        console.log('🔌 BLE: Smart Pot disconnect error (non-critical):', e.message);
      } finally {
        setConnectedSmartPot(null);
      }
    }
  };

  // Get parsed error for UI display
  const getParsedError = (): AppError | null => {
    if (!error && !permissionError) return null;
    return parseError(error || permissionError || 'Unknown error');
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
    error: error || permissionError,
    setError,
    getParsedError,
    getPersistedSSID,
    isReady,
    requestPermissions,
  };
} 