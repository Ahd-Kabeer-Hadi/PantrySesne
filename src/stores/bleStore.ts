import { Device } from 'react-native-ble-plx';
import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { getLastSSID, getProvisionedDevices, saveLastSSID, saveProvisionedDevice } from '../services/storage';

const storage = new MMKV();
const ONBOARDED_KEY = 'onboarded';

interface ProvisioningDevice {
  id: string;
  name: string;
  device: Device;
}

interface SmartPot {
  id: string;
  name: string;
  weight: string;
  device: Device;
  lastSeen: number;
}

interface BLEState {
  // Provisioning devices (SmartPotMaster for WiFi setup)
  provisioningDevices: ProvisioningDevice[];
  connectedProvisioningDevice: Device | null;
  
  // Smart Pots (SmartPot_01, SmartPot_02, etc.)
  smartPots: SmartPot[];
  connectedSmartPot: Device | null;
  
  // WiFi provisioning state
  provisioning: 'idle' | 'pending' | 'success' | 'error';
  
  // Scanning states
  scanningProvisioning: boolean;
  scanningSmartPots: boolean;
  
  // General state
  error: string | null;
  isOnboarded: boolean;
  
  // Actions
  setProvisioningDevices: (devices: ProvisioningDevice[]) => void;
  addProvisioningDevice: (device: ProvisioningDevice) => void;
  setConnectedProvisioningDevice: (device: Device | null) => void;
  
  setSmartPots: (pots: SmartPot[]) => void;
  addSmartPot: (pot: SmartPot) => void;
  updateSmartPotWeight: (id: string, weight: string) => void;
  setConnectedSmartPot: (device: Device | null) => void;
  
  setProvisioning: (status: 'idle' | 'pending' | 'success' | 'error') => void;
  setScanningProvisioning: (scanning: boolean) => void;
  setScanningSmartPots: (scanning: boolean) => void;
  setError: (err: string | null) => void;
  
  // Persistence
  persistProvisionedDevice: (device: { id: string; name: string }) => void;
  getPersistedDevices: () => { id: string; name: string }[];
  persistLastSSID: (ssid: string) => void;
  getPersistedSSID: () => string;
  setOnboarded: (value: boolean) => void;
  persistOnboardingComplete: () => void;
}

export const useBLEStore = create<BLEState>((set, get) => ({
  // Provisioning devices
  provisioningDevices: [],
  connectedProvisioningDevice: null,
  
  // Smart Pots
  smartPots: [],
  connectedSmartPot: null,
  
  // WiFi provisioning
  provisioning: 'idle',
  error: null,
  
  // Scanning states
  scanningProvisioning: false,
  scanningSmartPots: false,
  
  // Check if user has completed onboarding by looking at persisted devices
  isOnboarded: getProvisionedDevices().length > 0,
  
  // Provisioning device actions
  setProvisioningDevices: (devices) => set({ provisioningDevices: devices }),
  addProvisioningDevice: (device) => set((state) => ({ 
    provisioningDevices: [...state.provisioningDevices, device] 
  })),
  setConnectedProvisioningDevice: (device) => set({ connectedProvisioningDevice: device }),
  
  // Smart Pot actions
  setSmartPots: (pots) => set({ smartPots: pots }),
  addSmartPot: (pot) => set((state) => ({ 
    smartPots: [...state.smartPots, pot] 
  })),
  updateSmartPotWeight: (id, weight) => set((state) => ({
    smartPots: state.smartPots.map(pot => 
      pot.id === id ? { ...pot, weight, lastSeen: Date.now() } : pot
    )
  })),
  setConnectedSmartPot: (device) => set({ connectedSmartPot: device }),
  
  // General actions
  setProvisioning: (status) => set({ provisioning: status }),
  setScanningProvisioning: (scanning) => set({ scanningProvisioning: scanning }),
  setScanningSmartPots: (scanning) => set({ scanningSmartPots: scanning }),
  setError: (err) => set({ error: err }),
  
  // Persistence
  persistProvisionedDevice: (device) => saveProvisionedDevice(device),
  getPersistedDevices: () => getProvisionedDevices(),
  persistLastSSID: (ssid) => saveLastSSID(ssid),
  getPersistedSSID: () => getLastSSID(),
  setOnboarded: (value) => {
    set({ isOnboarded: value });
    storage.set(ONBOARDED_KEY, value ? 1 : 0);
  },
  persistOnboardingComplete: () => {
    set({ isOnboarded: true });
    storage.set(ONBOARDED_KEY, 1);
  },
})); 