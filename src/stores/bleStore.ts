import { Device } from 'react-native-ble-plx';
import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { getLastSSID, getProvisionedDevices, saveLastSSID, saveProvisionedDevice } from '../services/storage';

const storage = new MMKV();
const ONBOARDED_KEY = 'onboarded';

interface BLEState {
  devices: { id: string; name: string; device: Device }[];
  connectedDevice: Device | null;
  provisioning: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  isOnboarded: boolean;
  setDevices: (devices: { id: string; name: string; device: Device }[]) => void;
  addDevice: (device: { id: string; name: string; device: Device }) => void;
  setConnectedDevice: (device: Device | null) => void;
  setProvisioning: (status: 'idle' | 'pending' | 'success' | 'error') => void;
  setError: (err: string | null) => void;
  persistProvisionedDevice: (device: { id: string; name: string }) => void;
  getPersistedDevices: () => { id: string; name: string }[];
  persistLastSSID: (ssid: string) => void;
  getPersistedSSID: () => string;
  setOnboarded: (value: boolean) => void;
  persistOnboardingComplete: () => void;
}

export const useBLEStore = create<BLEState>((set, get) => ({
  devices: [],
  connectedDevice: null,
  provisioning: 'idle',
  error: null,
  isOnboarded: storage.getBoolean(ONBOARDED_KEY) || false,
  setDevices: (devices) => set({ devices }),
  addDevice: (device) => set((state) => ({ devices: [...state.devices, device] })),
  setConnectedDevice: (device) => set({ connectedDevice: device }),
  setProvisioning: (status) => set({ provisioning: status }),
  setError: (err) => set({ error: err }),
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