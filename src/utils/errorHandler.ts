// Error handling utilities for user-friendly error messages
export interface AppError {
  code: string;
  title: string;
  message: string;
  userMessage: string;
  solution: string;
  category: 'permission' | 'device' | 'network' | 'system';
  severity: 'low' | 'medium' | 'high';
}

// BLE Error mapping
const BLE_ERROR_MAP: Record<string, AppError> = {
  // Bluetooth permission errors
  'BluetoothAdapterNotEnabled': {
    code: 'BLE_PERMISSION_DISABLED',
    title: 'Bluetooth is Turned Off',
    message: 'Bluetooth adapter is not enabled',
    userMessage: 'Please turn on Bluetooth to connect to your device',
    solution: 'Go to Settings > Bluetooth and turn it on',
    category: 'permission',
    severity: 'medium'
  },
  'LocationPermissionDenied': {
    code: 'LOCATION_PERMISSION_DENIED',
    title: 'Location Permission Required',
    message: 'Location permission is required for Bluetooth scanning',
    userMessage: 'PantrySense needs location access to find nearby devices',
    solution: 'Go to Settings > Apps > PantrySense > Permissions and enable Location',
    category: 'permission',
    severity: 'medium'
  },
  'BluetoothPermissionDenied': {
    code: 'BLUETOOTH_PERMISSION_DENIED',
    title: 'Bluetooth Permission Required',
    message: 'Bluetooth permission is denied',
    userMessage: 'PantrySense needs Bluetooth access to connect to your device',
    solution: 'Go to Settings > Apps > PantrySense > Permissions and enable Bluetooth',
    category: 'permission',
    severity: 'medium'
  },

  // Connection errors
  'DeviceNotFound': {
    code: 'DEVICE_NOT_FOUND',
    title: 'Device Not Found',
    message: 'The selected device is no longer available',
    userMessage: 'The device you selected is no longer in range or has been disconnected',
    solution: 'Try scanning again or move closer to your device',
    category: 'device',
    severity: 'medium'
  },
  'ConnectionTimeout': {
    code: 'CONNECTION_TIMEOUT',
    title: 'Connection Timeout',
    message: 'Connection to device timed out',
    userMessage: 'The connection to your device took too long',
    solution: 'Make sure your device is nearby and try again',
    category: 'device',
    severity: 'medium'
  },
  'DeviceDisconnected': {
    code: 'DEVICE_DISCONNECTED',
    title: 'Device Disconnected',
    message: 'Connection to device was lost',
    userMessage: 'The connection to your device was interrupted',
    solution: 'Try reconnecting to your device',
    category: 'device',
    severity: 'medium'
  },

  // Provisioning errors
  'ProvisioningFailed': {
    code: 'PROVISIONING_FAILED',
    title: 'Setup Failed',
    message: 'Failed to configure device with WiFi credentials',
    userMessage: 'Unable to set up your device with the provided WiFi information',
    solution: 'Check your WiFi password and try again',
    category: 'network',
    severity: 'high'
  },
  'InvalidCredentials': {
    code: 'INVALID_CREDENTIALS',
    title: 'Invalid WiFi Password',
    message: 'The WiFi password provided is incorrect',
    userMessage: 'The WiFi password you entered is not correct',
    solution: 'Double-check your WiFi password and try again',
    category: 'network',
    severity: 'medium'
  },
  'NetworkUnavailable': {
    code: 'NETWORK_UNAVAILABLE',
    title: 'Network Unavailable',
    message: 'The specified WiFi network is not available',
    userMessage: 'The WiFi network you selected is not in range',
    solution: 'Make sure you are near the WiFi network and try again',
    category: 'network',
    severity: 'medium'
  },

  // System errors
  'BluetoothNotSupported': {
    code: 'BLUETOOTH_NOT_SUPPORTED',
    title: 'Bluetooth Not Supported',
    message: 'This device does not support Bluetooth Low Energy',
    userMessage: 'Your device does not support the required Bluetooth features',
    solution: 'Try using a different device that supports Bluetooth Low Energy',
    category: 'system',
    severity: 'high'
  },
  'UnknownError': {
    code: 'UNKNOWN_ERROR',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred',
    userMessage: 'Something unexpected happened. Please try again',
    solution: 'Restart the app and try again. If the problem persists, contact support',
    category: 'system',
    severity: 'medium'
  }
};

// Error message patterns to match
const ERROR_PATTERNS = [
  { pattern: /bluetooth.*disabled|bluetooth.*off/i, code: 'BLE_PERMISSION_DISABLED' },
  { pattern: /location.*permission|location.*access/i, code: 'LOCATION_PERMISSION_DENIED' },
  { pattern: /bluetooth.*permission|bluetooth.*access/i, code: 'BLUETOOTH_PERMISSION_DENIED' },
  { pattern: /device.*not.*found|device.*unavailable/i, code: 'DEVICE_NOT_FOUND' },
  { pattern: /timeout|timed.*out/i, code: 'CONNECTION_TIMEOUT' },
  { pattern: /disconnected|connection.*lost/i, code: 'DEVICE_DISCONNECTED' },
  { pattern: /provisioning.*failed|setup.*failed/i, code: 'PROVISIONING_FAILED' },
  { pattern: /invalid.*password|wrong.*password/i, code: 'INVALID_CREDENTIALS' },
  { pattern: /network.*unavailable|wifi.*unavailable/i, code: 'NETWORK_UNAVAILABLE' },
  { pattern: /bluetooth.*not.*supported|ble.*not.*supported/i, code: 'BLUETOOTH_NOT_SUPPORTED' },
];

export function parseError(error: string | Error): AppError {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  console.log('🔍 Error Handler: Parsing error:', errorMessage);
  
  // Try to match error patterns
  for (const { pattern, code } of ERROR_PATTERNS) {
    if (pattern.test(errorMessage)) {
      console.log('🔍 Error Handler: Matched pattern for code:', code);
      return BLE_ERROR_MAP[code] || BLE_ERROR_MAP['UnknownError'];
    }
  }

  // Check for exact matches
  for (const [key, appError] of Object.entries(BLE_ERROR_MAP)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      console.log('🔍 Error Handler: Exact match for code:', key);
      return appError;
    }
  }

  // Return unknown error if no match found
  console.log('🔍 Error Handler: No match found, returning unknown error');
  return {
    ...BLE_ERROR_MAP['UnknownError'],
    message: errorMessage,
  };
}

export function getErrorIcon(category: AppError['category']): string {
  switch (category) {
    case 'permission':
      return 'shield-outline';
    case 'device':
      return 'bluetooth-outline';
    case 'network':
      return 'wifi-outline';
    case 'system':
      return 'warning-outline';
    default:
      return 'alert-circle-outline';
  }
}

export function getErrorColor(severity: AppError['severity']): string {
  switch (severity) {
    case 'low':
      return 'warning';
    case 'medium':
      return 'error';
    case 'high':
      return 'error';
    default:
      return 'error';
  }
} 