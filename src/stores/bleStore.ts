import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import { Device } from "react-native-ble-plx";

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
  setError: (err: string | null) => void;
  
  // Persistence
  persistProvisionedDevice: (device: { id: string; name: string }) => void;
  getPersistedDevices: () => { id: string; name: string }[];
  persistLastSSID: (ssid: string) => void;
  getPersistedSSID: () => string;
  setOnboarded: (value: boolean) => void;
  persistOnboardingComplete: () => void;
}

// Helper functions for persistence
const getProvisionedDevices = (): { id: string; name: string }[] => {
  const devices = storage.getString('provisionedDevices');
  return devices ? JSON.parse(devices) : [];
};

const saveProvisionedDevice = (device: { id: string; name: string }) => {
  const devices = getProvisionedDevices();
  const exists = devices.find(d => d.id === device.id);
  if (!exists) {
    devices.push(device);
    storage.set('provisionedDevices', JSON.stringify(devices));
  }
};

const getLastSSID = (): string => {
  return storage.getString('lastSSID') || '';
};

const saveLastSSID = (ssid: string) => {
  storage.set('lastSSID', ssid);
};

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