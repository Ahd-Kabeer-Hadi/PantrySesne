import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const PERMISSION_KEY = 'ble_permissions_granted';
const LAST_SCAN_KEY = 'ble_last_scan_time';

export function getPermissionGranted(): boolean {
  return storage.getBoolean(PERMISSION_KEY) ?? false;
}

export function setPermissionGranted(granted: boolean) {
  storage.set(PERMISSION_KEY, granted);
}

export function getLastScanTime(): number | undefined {
  return storage.getNumber(LAST_SCAN_KEY);
}

export function setLastScanTime(timestamp: number) {
  storage.set(LAST_SCAN_KEY, timestamp);
}
