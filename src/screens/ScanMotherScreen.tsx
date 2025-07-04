import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, PermissionsAndroid, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DeviceInfo {
  id: string;
  name: string;
}

interface ScanMotherScreenProps {
  devices: DeviceInfo[];
  scanning: boolean;
  onRefresh: () => void;
  onSelect: (device: DeviceInfo) => void;
}

async function requestPermissions() {
  if (Platform.OS !== "android") return true;
  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];
    // Android 12+ (API 31+)
    if (Platform.Version >= 31) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      );
    }
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    // Check all requested permissions
    for (const perm of permissions) {
      if (granted[perm] !== PermissionsAndroid.RESULTS.GRANTED) {
        return false;
      }
    }
    return true;
  } catch (err) {
    return false;
  }
}

export default function ScanMotherScreen({ devices, scanning, onRefresh, onSelect }: ScanMotherScreenProps) {
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const granted = await requestPermissions();
    setPermissionsGranted(granted);
    if (granted) {
      onRefresh();
    }
  };

  const handleRefresh = async () => {
    if (!permissionsGranted) {
      const granted = await requestPermissions();
      setPermissionsGranted(granted);
      if (!granted) {
        Alert.alert(
          "Permissions Required",
          "Bluetooth and Location permissions are required to scan for devices. Please enable them in settings.",
          [{ text: "OK" }]
        );
        return;
      }
    }
    onRefresh();
  };

  const renderDevice = ({ item }: { item: DeviceInfo }) => (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      className="bg-white/80 rounded-2xl p-4 mb-3 shadow-soft backdrop-blur-sm active:scale-95 transition-all duration-200"
      style={{
        shadowColor: '#497174',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-primary/20 rounded-xl items-center justify-center mr-4">
          <Ionicons name="bluetooth" size={24} color="#497174" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground mb-1">
            {item.name || "Unknown Device"}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {item.id}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#497174" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-24 h-24 bg-muted/20 rounded-2xl items-center justify-center mb-6">
        <Ionicons name="bluetooth-outline" size={48} color="#5C5C5C" />
      </View>
      <Text className="text-lg font-semibold text-foreground text-center mb-2">
        No devices found
      </Text>
      <Text className="text-base text-muted-foreground text-center leading-relaxed max-w-sm">
        Make sure your Mother device is powered on and within range. 
        It should appear as "SmartPotMaster" in the list.
      </Text>
    </View>
  );

  const renderScanningState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-24 h-24 bg-primary/20 rounded-2xl items-center justify-center mb-6 breathing">
        <Ionicons name="bluetooth" size={48} color="#497174" />
      </View>
      <Text className="text-lg font-semibold text-foreground text-center mb-2">
        Scanning for devices...
      </Text>
      <Text className="text-base text-muted-foreground text-center">
        Looking for your Mother device
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Background Gradient */}
      <LinearGradient
        colors={['#F9FAFB', '#F0F7F8', '#D6E4E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      
      {/* Floating Background Elements */}
      <View className="absolute inset-0 overflow-hidden">
        <View className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
        <View className="absolute bottom-40 left-8 w-24 h-24 bg-accent/10 rounded-full blur-lg" />
      </View>

      <View className="flex-1 px-6 pt-8 pb-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-primary rounded-2xl shadow-soft mb-4 items-center justify-center">
            <Ionicons name="bluetooth" size={28} color="#FFFFFF" />
          </View>
          <Text className="text-2xl font-bold text-primary text-center mb-2">
            Find Your Device
          </Text>
          <Text className="text-base text-muted-foreground text-center">
            Let's connect to your Mother device
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          {permissionsGranted === false ? (
            <View className="flex-1 justify-center items-center py-12">
              <View className="w-24 h-24 bg-error/20 rounded-2xl items-center justify-center mb-6">
                <Ionicons name="warning" size={48} color="#E36565" />
              </View>
              <Text className="text-lg font-semibold text-foreground text-center mb-2">
                Permissions Required
              </Text>
              <Text className="text-base text-muted-foreground text-center leading-relaxed max-w-sm mb-6">
                Bluetooth and Location permissions are needed to scan for your device. 
                Please enable them in your device settings.
              </Text>
              <TouchableOpacity
                onPress={checkPermissions}
                className="bg-primary rounded-2xl py-3 px-6 shadow-soft"
              >
                <Text className="text-white font-semibold">Grant Permissions</Text>
              </TouchableOpacity>
            </View>
          ) : scanning ? (
            renderScanningState()
          ) : (
            <FlatList
              data={devices}
              renderItem={renderDevice}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              ListEmptyComponent={renderEmptyState()}
              ListHeaderComponent={
                <View className="mb-4">
                  <Text className="text-lg font-semibold text-foreground mb-2">
                    Available Devices
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Tap on your Mother device to connect
                  </Text>
                </View>
              }
            />
          )}
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity
            onPress={handleRefresh}
            disabled={scanning || permissionsGranted === false}
            className={`rounded-2xl py-4 px-6 shadow-soft ${
              scanning || permissionsGranted === false 
                ? 'bg-muted/50' 
                : 'bg-white/80 backdrop-blur-sm'
            }`}
          >
            <View className="flex-row items-center justify-center">
              {scanning ? (
                <>
                  <View className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  <Text className="text-primary font-semibold">Scanning...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="refresh" size={20} color="#497174" className="mr-2" />
                  <Text className="text-primary font-semibold">Refresh Scan</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          
          <Text className="text-xs text-muted-foreground text-center">
            {devices.length > 0 
              ? `${devices.length} device${devices.length > 1 ? 's' : ''} found`
              : "No devices in range"
            }
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
} 