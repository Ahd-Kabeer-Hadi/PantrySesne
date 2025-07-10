// stores/bleStore.ts
import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import type { Device } from "react-native-ble-plx";

// MMKV instance
const storage = new MMKV();
const ONBOARDED_KEY = "onboarded";

// Types
export interface ProvisioningDevice {
  id: string;
  name: string;
  device: Device;
}

export interface SmartPot {
  id: string;
  name: string;
  weight: string;
  device: Device;
  lastSeen: number;
}

export interface BLEDevice {
  id: string;
  name: string;
  rssi: number;
  isConnectable: boolean;
  raw: Device;
}

type ProvisioningStatus = "idle" | "pending" | "success" | "error";

interface BLEState {
  // BLE device state
  isScanning: boolean;
  devices: BLEDevice[];
  selectedDevice: Device | null;

  // Provisioning screen BLE devices (for setup)
  provisioningDevices: ProvisioningDevice[];
  connectedProvisioningDevice: Device | null;

  // SmartPot-specific devices
  smartPots: SmartPot[];
  connectedSmartPot: Device | null;

  // Provisioning and onboarding state
  provisioning: ProvisioningStatus;
  error: string | null;
  isOnboarded: boolean;

  // BLE state actions
  setIsScanning: (isScanning: boolean) => void;
  setDevices: (devices: BLEDevice[]) => void;
  setSelectedDevice: (device: Device | null) => void;

  // Provisioning actions
  setProvisioningDevices: (devices: ProvisioningDevice[]) => void;
  addProvisioningDevice: (device: ProvisioningDevice) => void;
  setConnectedProvisioningDevice: (device: Device | null) => void;

  // SmartPot actions
  setSmartPots: (pots: SmartPot[]) => void;
  addSmartPot: (pot: SmartPot) => void;
  updateSmartPotWeight: (id: string, weight: string) => void;
  setConnectedSmartPot: (device: Device | null) => void;

  // Provisioning and error
  setProvisioning: (status: ProvisioningStatus) => void;
  setError: (err: string | null) => void;

  // Persistence methods
  persistProvisionedDevice: (device: { id: string; name: string }) => void;
  getPersistedDevices: () => { id: string; name: string }[];
  persistLastSSID: (ssid: string) => void;
  getPersistedSSID: () => string;
  setOnboarded: (value: boolean) => void;
  persistOnboardingComplete: () => void;
}

// MMKV helpers
const getProvisionedDevices = (): { id: string; name: string }[] => {
  try {
    const devices = storage.getString("provisionedDevices");
    return devices ? JSON.parse(devices) : [];
  } catch {
    return [];
  }
};

const saveProvisionedDevice = (device: { id: string; name: string }) => {
  const existing = getProvisionedDevices();
  if (!existing.some((d) => d.id === device.id)) {
    const updated = [...existing, device];
    storage.set("provisionedDevices", JSON.stringify(updated));
  }
};

const getLastSSID = (): string => {
  return storage.getString("lastSSID") || "";
};

const saveLastSSID = (ssid: string) => {
  storage.set("lastSSID", ssid);
};

// Zustand Store
export const useBLEStore = create<BLEState>((set, get) => ({
  // BLE lifecycle
  isScanning: false,
  devices: [],
  selectedDevice: null,

  // BLE provisioning
  provisioningDevices: [],
  connectedProvisioningDevice: null,

  // SmartPot
  smartPots: [],
  connectedSmartPot: null,

  // Status and error
  provisioning: "idle",
  error: null,
  isOnboarded: getProvisionedDevices().length > 0,

  // BLE actions
  setIsScanning: (value) => set({ isScanning: value }),
  setDevices: (devicesOrUpdater) =>
    set((state) => ({
      devices:
        typeof devicesOrUpdater === 'function'
          ? devicesOrUpdater(state.devices)
          : devicesOrUpdater,
    })),
  setSelectedDevice: (device) => set({ selectedDevice: device }),

  // Provisioning actions
  setProvisioningDevices: (devices) => set({ provisioningDevices: devices }),
  addProvisioningDevice: (device) =>
    set((state) => ({
      provisioningDevices: [...state.provisioningDevices, device],
    })),
  setConnectedProvisioningDevice: (device) =>
    set({ connectedProvisioningDevice: device }),

  // SmartPot actions
  setSmartPots: (pots) => set({ smartPots: pots }),
  addSmartPot: (pot) =>
    set((state) => ({
      smartPots: [...state.smartPots, pot],
    })),
  updateSmartPotWeight: (id, weight) =>
    set((state) => ({
      smartPots: state.smartPots.map((pot) =>
        pot.id === id
          ? { ...pot, weight, lastSeen: Date.now() }
          : pot
      ),
    })),
  setConnectedSmartPot: (device) => set({ connectedSmartPot: device }),

  // General status
  setProvisioning: (status) => set({ provisioning: status }),
  setError: (err) => set({ error: err }),

  // Persistence
  persistProvisionedDevice: (device) => saveProvisionedDevice(device),
  getPersistedDevices: () => getProvisionedDevices(),
  persistLastSSID: (ssid) => saveLastSSID(ssid),
  getPersistedSSID: () => getLastSSID(),
  setOnboarded: (value) => {
    set({ isOnboarded: value });
    storage.set(ONBOARDED_KEY, value ? "1" : "0");
  },
  persistOnboardingComplete: () => {
    set({ isOnboarded: true });
    storage.set(ONBOARDED_KEY, "1");
  },
}));
