import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const PROVISIONED_DEVICES_KEY = 'provisioned_devices';
const LAST_SSID_KEY = 'last_ssid';
const ONBOARDED_KEY = 'onboarded';

export function saveProvisionedDevice(device: { id: string; name: string }) {
  const devices = getProvisionedDevices();
  const updated = [...devices.filter(d => d.id !== device.id), device];
  storage.set(PROVISIONED_DEVICES_KEY, JSON.stringify(updated));
}

export function getProvisionedDevices(): { id: string; name: string }[] {
  const raw = storage.getString(PROVISIONED_DEVICES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLastSSID(ssid: string) {
  storage.set(LAST_SSID_KEY, ssid);
}

export function getLastSSID(): string {
  return storage.getString(LAST_SSID_KEY) || '';
}

export function saveOnboardingComplete() {
  storage.set(ONBOARDED_KEY, 1);
}

export function getOnboardingComplete(): boolean {
  return !!storage.getBoolean(ONBOARDED_KEY);
} 