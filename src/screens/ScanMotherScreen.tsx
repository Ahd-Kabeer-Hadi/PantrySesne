import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedContainer, ThemedCard, ThemedText, ThemedButton, ThemedBadge } from "../components/ThemedComponents";

interface BLEDevice {
  id: string;
  name: string;
  rssi: number;
  isConnectable: boolean;
}

interface ScanMotherScreenProps {
  devices: BLEDevice[];
  scanning: boolean;
  onRefresh: () => void;
  onSelect: (device: BLEDevice) => void;
}

export default function ScanMotherScreen({ 
  devices, 
  scanning, 
  onRefresh, 
  onSelect 
}: ScanMotherScreenProps) {
  
  // Component-level state for user feedback
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  // Watch for changes in devices to provide accurate feedback when scan completes
  useEffect(() => {
    console.log('🔍 ScanMotherScreen: State change - isScanning:', isScanning, 'devices.length:', devices.length);
    
    // If we were scanning and now have devices, scan completed successfully
    if (isScanning && devices.length > 0) {
      console.log('🔍 ScanMotherScreen: Scan completed successfully with devices');
      setIsScanning(false);
      setScanError(null);
    }
    // If we were scanning and still no devices after a delay, show helpful message
    else if (isScanning && devices.length === 0) {
      console.log('🔍 ScanMotherScreen: Still scanning, setting timeout for completion');
      // Add a small delay to allow for devices to be found
      const timer = setTimeout(() => {
        if (isScanning && devices.length === 0) {
          console.log('🔍 ScanMotherScreen: Scan timeout - no devices found');
          setIsScanning(false);
          setScanError('No SmartPot Master devices found. Please check if your device is powered on and in range.');
        }
      }, 8000); // Match BLE service timeout
      
      return () => clearTimeout(timer);
    }
  }, [isScanning, devices.length]);
  
  const handleRefresh = async () => {
    if (isScanning) return;
    
    console.log('🔍 ScanMotherScreen: Starting scan...');
    setIsScanning(true);
    setScanError(null);
    
    try {
      onRefresh();
    } catch (error) {
      console.log('🔍 ScanMotherScreen: Scan failed:', error);
      setScanError('Failed to start scan. Please check your Bluetooth settings and try again.');
      setIsScanning(false);
    }
  };

  // Use only local state for UI feedback
  const showScanning = isScanning;
  const showError = scanError;

  const renderScanningState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-primary/20 rounded-3xl items-center justify-center mb-8">
        <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </View>
      <ThemedText size="2xl" weight="bold" className="text-center mb-4">
        Scanning for Devices
      </ThemedText>
      <ThemedText variant="secondary" className="text-center leading-relaxed max-w-sm mb-8">
        Looking for SmartPot Master devices in your area...
      </ThemedText>
      
      {/* Progress indicator */}
      <View className="w-64 h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <View className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
      </View>
      
      <View className="flex-row items-center justify-center space-x-2">
        <View className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <View className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <View className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </View>
      
      <ThemedText size="sm" variant="tertiary" className="text-center mt-4">
        This may take up to 8 seconds...
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-accent/20 rounded-3xl items-center justify-center mb-8">
        <Ionicons name="wifi" size={64} color="#b8b8b8" />
      </View>
      <ThemedText size="2xl" weight="bold" className="text-center mb-4">
        No SmartPot Master Found
      </ThemedText>
      <ThemedText variant="secondary" className="text-center leading-relaxed max-w-sm mb-8">
        {showError || "Make sure your SmartPot Master device is powered on and in provisioning mode."}
      </ThemedText>
      
      {/* Troubleshooting tips */}
      <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 w-full max-w-sm">
        <ThemedText size="sm" weight="semibold" className="mb-3 text-gray-800">
          Troubleshooting Tips:
        </ThemedText>
        <View className="space-y-2">
          <View className="flex-row items-start">
            <View className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
            <ThemedText size="sm" variant="secondary" className="flex-1">
              Ensure Bluetooth is turned on
            </ThemedText>
          </View>
          <View className="flex-row items-start">
            <View className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
            <ThemedText size="sm" variant="secondary" className="flex-1">
              Check that your device is within 10 meters
            </ThemedText>
          </View>
          <View className="flex-row items-start">
            <View className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
            <ThemedText size="sm" variant="secondary" className="flex-1">
              Make sure the SmartPot Master is in setup mode
            </ThemedText>
          </View>
        </View>
      </View>
      
      <ThemedButton
        variant="secondary"
        size="lg"
        onPress={handleRefresh}
        className="shadow-lg"
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="refresh" size={20} color="#0c0b0e" className="mr-2" />
          <ThemedText size="lg" weight="semibold" variant="secondary">
            Try Again
          </ThemedText>
        </View>
      </ThemedButton>
    </View>
  );

  const renderSuccessState = () => (
    <View className="flex-1">
      {/* Status Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <ThemedText size="xl" weight="semibold" className="mb-1">
            Available Devices
          </ThemedText>
          <ThemedText variant="secondary">
            {devices.length} device{devices.length !== 1 ? 's' : ''} found
          </ThemedText>
        </View>
        <ThemedBadge variant="success" size="sm">
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            Success
          </View>
        </ThemedBadge>
      </View>

      {/* Success message */}
      <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={24} color="#8fb716" className="mr-3" />
          <View className="flex-1">
            <ThemedText size="sm" weight="semibold" className="text-green-800 mb-1">
              Scan Completed Successfully
            </ThemedText>
            <ThemedText size="sm" variant="secondary" className="text-green-700">
              Found {devices.length} SmartPot Master device{devices.length > 1 ? 's' : ''} ready for connection
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Devices List */}
      <View className="flex-1">
        {devices.map(renderDeviceCard)}
      </View>

      {/* Action Buttons */}
      <View className="space-y-3">
        <ThemedButton
          variant="secondary"
          onPress={handleRefresh}
          className="shadow-lg"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="refresh" size={20} color="#8fb716" className="mr-2" />
            <ThemedText variant="primary" weight="semibold">Scan Again</ThemedText>
          </View>
        </ThemedButton>
        
        <ThemedText size="sm" variant="tertiary" className="text-center">
          Tap on a device to connect and configure WiFi
        </ThemedText>
      </View>
    </View>
  );

  const renderDeviceCard = (device: BLEDevice) => {
    const signalStrength = device.rssi > -50 ? "Excellent" : 
                          device.rssi > -70 ? "Good" : 
                          device.rssi > -90 ? "Fair" : "Poor";
    
    const signalColor = device.rssi > -50 ? "#8fb716" : 
                       device.rssi > -70 ? "#e4fa5b" : 
                       device.rssi > -90 ? "#b8b8b8" : "#dc2626";

    // Check if this is a SmartPotMaster device
    const isSmartPotMaster = device.name.includes('SmartPotMaster') || device.name.includes('SmartPot');
    const deviceType = isSmartPotMaster ? "SmartPot Master" : "Unknown Device";

    return (
      <ThemedCard
        key={device.id}
        variant="elevated"
        onPress={() => onSelect(device)}
        className="mb-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 bg-primary/20 rounded-xl items-center justify-center mr-4">
              <Ionicons 
                name={isSmartPotMaster ? "wifi" : "bluetooth"} 
                size={24} 
                color="#8fb716" 
              />
            </View>
            <View className="flex-1">
              <ThemedText size="lg" weight="semibold" className="mb-1">
                {device.name || "Unknown Device"}
              </ThemedText>
              <View className="flex-row items-center mb-1">
                <ThemedBadge variant="secondary" size="sm">
                  {deviceType}
                </ThemedBadge>
              </View>
              <View className="flex-row items-center">
                <ThemedText size="sm" variant="secondary" className="mr-3">
                  Signal: {signalStrength}
                </ThemedText>
                <View 
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: signalColor }}
                />
                <ThemedText size="sm" variant="secondary">
                  {device.rssi} dBm
                </ThemedText>
              </View>
            </View>
          </View>
          <View className="items-end">
            <ThemedBadge 
              variant={device.isConnectable ? "success" : "warning"}
              size="sm"
            >
              {device.isConnectable ? "Available" : "Busy"}
            </ThemedBadge>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color="#6b7280" 
              className="mt-2"
            />
          </View>
        </View>
      </ThemedCard>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-accent/20 rounded-3xl items-center justify-center mb-8">
        <Ionicons name="wifi" size={64} color="#b8b8b8" />
      </View>
      <ThemedText size="2xl" weight="bold" className="text-center mb-4">
        No SmartPot Master Found
      </ThemedText>
      <ThemedText variant="secondary" className="text-center leading-relaxed max-w-sm mb-8">
        Make sure your SmartPot Master device is powered on and in provisioning mode. Try refreshing the scan.
      </ThemedText>
      
      <ThemedButton
        variant="secondary"
        size="lg"
        onPress={handleRefresh}
        className="shadow-lg"
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="refresh" size={20} color="#0c0b0e" className="mr-2" />
          <ThemedText size="lg" weight="semibold" variant="secondary">
            Refresh Scan
          </ThemedText>
        </View>
      </ThemedButton>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <ThemedContainer className="flex-1">
        <View className="flex-1 px-6 pt-8 pb-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary rounded-2xl shadow-lg mb-6 items-center justify-center">
              <Ionicons name="wifi" size={36} color="#FFFFFF" />
            </View>
            <ThemedText size="2xl" weight="bold" className="text-center mb-3">
              Find SmartPot Master
            </ThemedText>
            <ThemedText variant="secondary" className="text-center max-w-xs">
              Connect to your SmartPot Master device to set up WiFi
            </ThemedText>
          </View>

          {/* Content */}
          {showScanning ? (
            renderScanningState()
          ) : showError ? (
            renderErrorState()
          ) : devices.length > 0 ? (
            renderSuccessState()
          ) : (
            renderEmptyState()
          )}
        </View>
      </ThemedContainer>
    </SafeAreaView>
  );
} 