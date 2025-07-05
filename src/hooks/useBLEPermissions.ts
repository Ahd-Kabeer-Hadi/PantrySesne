import { useState, useEffect } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import { BleManager, State } from 'react-native-ble-plx';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

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

  // Check Bluetooth state
  const checkBluetoothState = async () => {
    try {
      const state = await manager.state();
      const isEnabled = state === State.PoweredOn;
      console.log('🔍 BLE Permissions: Bluetooth state:', state, 'enabled:', isEnabled);
      setPermissionState(prev => ({
        ...prev,
        bluetoothEnabled: isEnabled,
        error: isEnabled ? null : 'Bluetooth is not enabled',
      }));
      return isEnabled;
    } catch (error) {
      console.log('🔍 BLE Permissions: Failed to check Bluetooth state:', error);
      setPermissionState(prev => ({
        ...prev,
        bluetoothEnabled: false,
        error: 'Failed to check Bluetooth state',
      }));
      return false;
    }
  };

  // Check and request location permission
  const checkLocationPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      console.log('🔍 BLE Permissions: Checking location permission...');
      const result = await check(permission);
      console.log('🔍 BLE Permissions: Location permission result:', result);
      
      if (result === RESULTS.GRANTED) {
        setPermissionState(prev => ({
          ...prev,
          locationPermission: 'granted',
        }));
        return true;
      }

      if (result === RESULTS.DENIED) {
        console.log('🔍 BLE Permissions: Requesting location permission...');
        const requestResult = await request(permission);
        console.log('🔍 BLE Permissions: Location permission request result:', requestResult);
        
        if (requestResult === RESULTS.GRANTED) {
          setPermissionState(prev => ({
            ...prev,
            locationPermission: 'granted',
          }));
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
      console.log('🔍 BLE Permissions: Location permission error:', error);
      setPermissionState(prev => ({
        ...prev,
        locationPermission: 'unavailable',
        error: 'Failed to check location permission',
      }));
      return false;
    }
  };

  // Check Bluetooth permission (Android 12+ only)
  const checkBluetoothPermission = async () => {
    if (Platform.OS === 'ios') {
      // iOS doesn't have separate Bluetooth permission
      console.log('🔍 BLE Permissions: iOS - no separate Bluetooth permission needed');
      setPermissionState(prev => ({
        ...prev,
        bluetoothPermission: 'granted',
      }));
      return true;
    }

    // For Android, check if we're on Android 12+ (API 31+)
    const androidVersion = Platform.Version;
    console.log('🔍 BLE Permissions: Android version:', androidVersion);
    
    if (typeof androidVersion === 'number' && androidVersion < 31) {
      // Android 10-11: No separate Bluetooth permission needed
      console.log('🔍 BLE Permissions: Android < 12 - no separate Bluetooth permission needed');
      setPermissionState(prev => ({
        ...prev,
        bluetoothPermission: 'granted',
      }));
      return true;
    }

    // Android 12+: Check BLUETOOTH_CONNECT permission
    try {
      const permission = PERMISSIONS.ANDROID.BLUETOOTH_CONNECT;
      console.log('🔍 BLE Permissions: Checking Bluetooth permission (Android 12+)...');
      const result = await check(permission);
      console.log('🔍 BLE Permissions: Bluetooth permission result:', result);
      
      if (result === RESULTS.GRANTED) {
        setPermissionState(prev => ({
          ...prev,
          bluetoothPermission: 'granted',
        }));
        return true;
      }

      if (result === RESULTS.DENIED) {
        console.log('🔍 BLE Permissions: Requesting Bluetooth permission...');
        const requestResult = await request(permission);
        console.log('🔍 BLE Permissions: Bluetooth permission request result:', requestResult);
        
        if (requestResult === RESULTS.GRANTED) {
          setPermissionState(prev => ({
            ...prev,
            bluetoothPermission: 'granted',
          }));
          return true;
        } else {
          setPermissionState(prev => ({
            ...prev,
            bluetoothPermission: 'denied',
            error: 'Bluetooth permission is required',
          }));
          return false;
        }
      }

      if (result === RESULTS.BLOCKED) {
        setPermissionState(prev => ({
          ...prev,
          bluetoothPermission: 'blocked',
          error: 'Bluetooth permission is blocked. Please enable it in settings.',
        }));
        return false;
      }

      setPermissionState(prev => ({
        ...prev,
        bluetoothPermission: 'unavailable',
        error: 'Bluetooth permission is not available',
      }));
      return false;
    } catch (error) {
      console.log('🔍 BLE Permissions: Bluetooth permission error:', error);
      setPermissionState(prev => ({
        ...prev,
        bluetoothPermission: 'unavailable',
        error: 'Failed to check Bluetooth permission',
      }));
      return false;
    }
  };

  // Check all permissions
  const checkAllPermissions = async () => {
    console.log('🔍 BLE Permissions: Checking all permissions...');
    setPermissionState(prev => ({ ...prev, error: null }));

    const [bluetoothEnabled, locationGranted, bluetoothGranted] = await Promise.all([
      checkBluetoothState(),
      checkLocationPermission(),
      checkBluetoothPermission(),
    ]);

    const isReady = bluetoothEnabled && locationGranted && bluetoothGranted;
    
    console.log('🔍 BLE Permissions: All permissions ready:', isReady, {
      bluetoothEnabled,
      locationGranted,
      bluetoothGranted
    });
    
    setPermissionState(prev => ({
      ...prev,
      isReady,
    }));

    return isReady;
  };

  // Request permissions with user guidance (only for blocked permissions)
  const requestPermissions = async () => {
    console.log('🔍 BLE Permissions: Requesting permissions...');
    const isReady = await checkAllPermissions();
    
    if (!isReady) {
      console.log('🔍 BLE Permissions: Permissions not ready, showing alert');
      Alert.alert(
        'Permissions Required',
        'PantrySense needs Bluetooth and Location permissions to scan for devices. Please enable them in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Settings', 
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }
          }
        ]
      );
    }

    return isReady;
  };

  // Listen for Bluetooth state changes
  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      const isEnabled = state === State.PoweredOn;
      console.log('🔍 BLE Permissions: Bluetooth state changed:', state, 'enabled:', isEnabled);
      setPermissionState(prev => ({
        ...prev,
        bluetoothEnabled: isEnabled,
        error: isEnabled ? null : 'Bluetooth is not enabled',
      }));
    }, true);

    return () => subscription.remove();
  }, [manager]);

  // Initial permission check
  useEffect(() => {
    checkAllPermissions();
  }, []);

  return {
    ...permissionState,
    checkAllPermissions,
    requestPermissions,
    checkBluetoothState,
    checkLocationPermission,
    checkBluetoothPermission,
  };
} 