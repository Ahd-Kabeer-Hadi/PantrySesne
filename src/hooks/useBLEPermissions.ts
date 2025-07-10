import { useState, useEffect } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import { BleManager, State } from 'react-native-ble-plx';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { getPermissionGranted, setPermissionGranted } from '../lib/mmkvUtils';

export interface BLEPermissionState {
  bluetoothEnabled: boolean;
  locationPermission: 'granted' | 'denied' | 'blocked' | 'unavailable';
  bluetoothPermission: 'granted' | 'denied' | 'blocked' | 'unavailable';
  isReady: boolean;
  error: string | null;
}

export function useBLEPermissions() {
  const [permissionState, setPermissionState] = useState<BLEPermissionState>({
    bluetoothEnabled: false,
    locationPermission: 'unavailable',
    bluetoothPermission: 'unavailable',
    isReady: false,
    error: null,
  });

  const [manager] = useState(() => new BleManager());

  // ✅ Check if Bluetooth is powered on
  const checkBluetoothState = async () => {
    try {
      const state = await manager.state();
      const isEnabled = state === State.PoweredOn;

      console.log('🔍 [Bluetooth State] Raw state:', state);
      console.log('✅ [Bluetooth Enabled]:', isEnabled);

      setPermissionState(prev => ({
        ...prev,
        bluetoothEnabled: isEnabled,
        error: isEnabled ? null : 'Bluetooth is not enabled',
      }));

      return isEnabled;
    } catch (error) {
      console.error('❌ [Bluetooth Error]: Failed to check state:', error);

      setPermissionState(prev => ({
        ...prev,
        bluetoothEnabled: false,
        error: 'Failed to check Bluetooth state',
      }));

      return false;
    }
  };

  // ✅ Check and request Location Permission (Required for BLE on Android)
  const checkLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      console.log('🔍 [Location Permission] Checking permission for:', permission);
      const result = await check(permission);
      console.log('🔍 [Location Permission] Check result:', result);

      if (result === RESULTS.GRANTED) {
        console.log('✅ [Location Permission] Already granted');
        setPermissionState(prev => ({ ...prev, locationPermission: 'granted' }));
        return true;
      }

      if (result === RESULTS.DENIED) {
        console.log('📡 [Location Permission] Requesting permission...');
        const requestResult = await request(permission);
        console.log('📡 [Location Permission] Request result:', requestResult);

        if (requestResult === RESULTS.GRANTED) {
          setPermissionState(prev => ({ ...prev, locationPermission: 'granted' }));
          return true;
        } else {
          setPermissionState(prev => ({
            ...prev,
            locationPermission: 'denied',
            error: 'Location permission is required for Bluetooth scanning',
          }));
          return false;
        }
      }

      if (result === RESULTS.BLOCKED) {
        console.warn('🚫 [Location Permission] Blocked in settings');
        setPermissionState(prev => ({
          ...prev,
          locationPermission: 'blocked',
          error: 'Location permission is blocked. Please enable it in settings.',
        }));
        return false;
      }

      setPermissionState(prev => ({
        ...prev,
        locationPermission: 'unavailable',
        error: 'Location permission is not available',
      }));
      return false;
    } catch (error) {
      console.error('❌ [Location Permission] Error checking location:', error);
      setPermissionState(prev => ({
        ...prev,
        locationPermission: 'unavailable',
        error: 'Failed to check location permission',
      }));
      return false;
    }
  };

  // ✅ Check and request Bluetooth permissions (only applies for Android 12+)
  const checkBluetoothPermission = async () => {
    if (Platform.OS === 'ios') {
      console.log('ℹ️ [iOS] No explicit Bluetooth permission required');
      setPermissionState(prev => ({ ...prev, bluetoothPermission: 'granted' }));
      return true;
    }

    const androidVersion = Platform.Version;
    console.log('🔍 [Android Version]:', androidVersion);

    // ✅ Android < 12 doesn't need explicit BLUETOOTH_CONNECT/SCAN permissions
    if (typeof androidVersion === 'number' && androidVersion < 31) {
      console.log('✅ [Android <12] No extra Bluetooth permission needed');
      setPermissionState(prev => ({ ...prev, bluetoothPermission: 'granted' }));
      return true;
    }

    // ✅ Android 12+ permissions
    try {
      const connectPermission = PERMISSIONS.ANDROID.BLUETOOTH_CONNECT;
      const scanPermission = PERMISSIONS.ANDROID.BLUETOOTH_SCAN;

      console.log('🔍 [Bluetooth Permission] Checking BLUETOOTH_CONNECT...');
      const connectResult = await check(connectPermission);
      console.log('🔍 [Bluetooth CONNECT] Result:', connectResult);

      console.log('🔍 [Bluetooth Permission] Checking BLUETOOTH_SCAN...');
      const scanResult = await check(scanPermission);
      console.log('🔍 [Bluetooth SCAN] Result:', scanResult);

      let granted = connectResult === RESULTS.GRANTED && scanResult === RESULTS.GRANTED;

      // Request if not granted
      if (!granted) {
        if (connectResult === RESULTS.DENIED) {
          const connectRequest = await request(connectPermission);
          console.log('📡 [Bluetooth CONNECT] Request result:', connectRequest);
          granted = connectRequest === RESULTS.GRANTED;
        }
        if (scanResult === RESULTS.DENIED) {
          const scanRequest = await request(scanPermission);
          console.log('📡 [Bluetooth SCAN] Request result:', scanRequest);
          granted = granted && scanRequest === RESULTS.GRANTED;
        }
      }

      if (granted) {
        console.log('✅ [Bluetooth Permission] All permissions granted');
        setPermissionState(prev => ({ ...prev, bluetoothPermission: 'granted' }));
        return true;
      }

      console.warn('🚫 [Bluetooth Permission] Missing permissions');
      setPermissionState(prev => ({
        ...prev,
        bluetoothPermission: 'denied',
        error: 'Bluetooth permissions (CONNECT/SCAN) are required',
      }));
      return false;
    } catch (error) {
      console.error('❌ [Bluetooth Permission] Error checking Bluetooth permissions:', error);
      setPermissionState(prev => ({
        ...prev,
        bluetoothPermission: 'unavailable',
        error: 'Failed to check Bluetooth permission',
      }));
      return false;
    }
  };

  // MMKV: Check if permissions are already granted
  const checkCachedPermissions = async () => {
    if (getPermissionGranted()) {
      setPermissionState(prev => ({
        ...prev,
        bluetoothEnabled: true,
        locationPermission: 'granted',
        bluetoothPermission: 'granted',
        isReady: true,
        error: null,
      }));
      return true;
    }
    return false;
  };

  // ✅ Run all permission checks and update final state
  const checkAllPermissions = async () => {
    // MMKV: Gate with cached permissions
    const cached = await checkCachedPermissions();
    if (cached) {
      return true;
    }
    console.log('🔄 [Permissions] Starting full permission check...');
    setPermissionState(prev => ({ ...prev, error: null }));

    const [bluetoothEnabled, locationGranted, bluetoothGranted] = await Promise.all([
      checkBluetoothState(),
      checkLocationPermission(),
      checkBluetoothPermission(),
    ]);

    const isReady = bluetoothEnabled && locationGranted && bluetoothGranted;
    setPermissionState(prev => ({
      ...prev,
      isReady,
      error: isReady ? null : prev.error,
    }));
    if (isReady) {
      setPermissionGranted(true);
    }
    return isReady;
  };

  // ✅ Show alert if permissions are not ready
  const requestPermissions = async () => {
    // MMKV: Gate with cached permissions
    const cached = await checkCachedPermissions();
    if (cached) {
      return true;
    }
    console.log('📢 [Permissions] Requesting user to approve permissions...');
    const isReady = await checkAllPermissions();

    if (!isReady) {
      console.warn('🚨 [Permissions] Not ready, showing alert');
      Alert.alert(
        'Permissions Required',
        'PantrySense needs Bluetooth and Location permissions to scan for devices. Please enable them in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              const url = Platform.OS === 'ios' ? 'app-settings:' : 'package:com.kabeerhadi.PantrySense';
              Linking.openURL(url);
            },
          },
        ]
      );
    }

    return isReady;
  };

  // ✅ Subscribe to Bluetooth state changes in real-time
  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      const isEnabled = state === State.PoweredOn;
      console.log('📶 [Bluetooth State Change]:', state, 'Enabled:', isEnabled);

      setPermissionState(prev => ({
        ...prev,
        bluetoothEnabled: isEnabled,
        error: isEnabled ? null : 'Bluetooth is not enabled',
      }));
    }, true);

    return () => subscription.remove();
  }, [manager]);

  // Optionally, run checkAllPermissions on mount (if you want auto-check)
  useEffect(() => {
    checkAllPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...permissionState,
    requestPermissions,
    checkAllPermissions,
    checkBluetoothState,
    checkLocationPermission,
    checkBluetoothPermission,
  };
}
