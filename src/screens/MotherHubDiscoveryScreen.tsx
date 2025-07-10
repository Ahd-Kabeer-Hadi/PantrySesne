// screens/MotherHubDiscoveryScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { useState, useEffect } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ThemedContainer,
  ThemedCard,
  ThemedText,
  ThemedButton,
  ThemedBadge,
} from "../components/ThemedComponents";
import { useBLEStore } from "../stores/bleStore";
import { useBLEPermissions } from "../hooks/useBLEPermissions";
import { getLastScanTime } from "../lib/mmkvUtils";
import { LONG_COOLDOWN_MS } from "../hooks/useBLE";

interface BLEDevice {
  id: string;
  name: string;
  rssi: number;
  isConnectable: boolean;
}

interface MotherHubDiscoveryScreenProps {
  onRefresh: () => void;
  onSelect: (device: BLEDevice) => void;
}

type ViewState = "empty" | "scanning" | "error" | "success";

export default function MotherHubDiscoveryScreen({
  onRefresh,
  onSelect,
}: MotherHubDiscoveryScreenProps) {
  const { devices, isScanning } = useBLEStore();
  const [scanError, setScanError] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const {
    isReady: permissionsReady,
    error: permissionsError,
    requestPermissions,
  } = useBLEPermissions();
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    console.log(
      "🔍 ScanMotherScreen: State change - isScanning:",
      isScanning,
      "devices.length:",
      devices.length
    );

    if (isScanning && devices.length > 0) {
      console.log(
        "🔍 ScanMotherScreen: Scan completed successfully with devices"
      );
      setScanError(null);
    } else if (isScanning && devices.length === 0) {
      const timer = setTimeout(() => {
        if (isScanning && devices.length === 0) {
          console.log("🔍 ScanMotherScreen: Scan timeout - no devices found");
          setScanError(
            "No PantrySense Hub devices found. Please check if your device is powered on and in range."
          );
        }
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isScanning, devices.length]);

  useEffect(() => {
    if (permissionsError) {
      setScanError(permissionsError);
    }
  }, [permissionsError]);

  useEffect(() => {
    const checkCooldown = () => {
      if (cooldown) {
        console.log("cooling down");
      }
      const lastScan = getLastScanTime();
      if (lastScan) {
        const now = Date.now();
        const remaining = LONG_COOLDOWN_MS - (now - lastScan);
        setCooldown(remaining > 0 ? remaining : 0);
      } else {
        setCooldown(0);
      }
    };
    checkCooldown();
    const interval = setInterval(checkCooldown, 500);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async (): Promise<void> => {
    if (isScanning || cooldown > 0) return;

    setScanError(null);
    console.log("🔍 ScanMotherScreen: Starting scan...");
    try {
      const granted = await requestPermissions();
      if (!granted) {
        setScanError(
          "Permissions not granted. Please enable Bluetooth and Location permissions."
        );
        return;
      }
      onRefresh();
    } catch (error) {
      console.log("🔍 ScanMotherScreen: Scan failed:", error);
      setScanError(
        "Failed to start scan. Please check your Bluetooth settings and try again."
      );
    }
  };

  const prevIsScanningRef = React.useRef(isScanning);
  useEffect(() => {
    if (prevIsScanningRef.current && !isScanning) {
      setHasScanned(true);
    }
    prevIsScanningRef.current = isScanning;
  }, [isScanning]);

  const getCurrentViewState = (): ViewState => {
    if (isScanning) return "scanning";
    if (scanError) return "error";
    if (devices.length > 0) return "success";
    if (hasScanned) return "error";
    return "empty";
  };

  const getSignalStrength = (
    rssi: number
  ): { label: string; color: string; bars: number } => {
    if (rssi > -50) return { label: "Excellent", color: "#16a34a", bars: 4 };
    if (rssi > -70) return { label: "Good", color: "#ca8a04", bars: 3 };
    if (rssi > -90) return { label: "Fair", color: "#ea580c", bars: 2 };
    return { label: "Poor", color: "#dc2626", bars: 1 };
  };

  const isPantrySenseDevice = (deviceName: string): boolean => {
    return (
      deviceName.includes("PantrySense") ||
      deviceName.includes("SmartPotMaster") ||
      deviceName.includes("SmartPot")
    );
  };

  const SignalBars = ({ rssi }: { rssi: number }) => {
    const { color, bars } = getSignalStrength(rssi);

    return (
      <View className="flex-row items-end">
        {Array.from({ length: 4 }, (_, i) => (
          <View
            key={i}
            className={`w-1 rounded-full mr-0.5`}
            style={{
              height: 4 + i * 2,
              backgroundColor: i < bars ? color : "#d1d5db",
            }}
          />
        ))}
      </View>
    );
  };

  const DeviceCard = ({ device }: { device: BLEDevice }) => {
    const { label: signalLabel } = getSignalStrength(device.rssi);
    const isPantrySense = isPantrySenseDevice(device.name);
    const deviceType = isPantrySense ? "PantrySense Hub" : "Unknown Device";

    return (
      <ThemedCard
        variant="elevated"
        onPress={() => onSelect(device)}
        className="mb-3 border border-gray-100"
      >
        <View className="flex-row items-center p-1">
          <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center mr-4">
            <Ionicons
              name={isPantrySense ? "storefront" : "bluetooth"}
              size={24}
              color="#8fb716"
            />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <ThemedText
                size="base"
                weight="semibold"
                className="flex-1"
                numberOfLines={1}
              >
                {device.name || "Unknown Device"}
              </ThemedText>
              <ThemedBadge
                variant={device.isConnectable ? "success" : "warning"}
                size="sm"
              >
                {device.isConnectable ? "Ready" : "Busy"}
              </ThemedBadge>
            </View>

            <View className="flex-row items-center justify-between">
              <ThemedText size="sm" variant="secondary">
                {deviceType}
              </ThemedText>

              <View className="flex-row items-center">
                <SignalBars rssi={device.rssi} />
                <ThemedText size="sm" variant="secondary" className="ml-2">
                  {signalLabel}
                </ThemedText>
              </View>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={16}
            color="#9ca3af"
            className="ml-2"
          />
        </View>
      </ThemedCard>
    );
  };

  const ScanningView = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6">
        <Ionicons name="search" size={32} color="#8fb716" />
      </View>

      <ThemedText size="xl" weight="bold" className="text-center mb-2">
        Discovering Devices
      </ThemedText>
      <ThemedText variant="secondary" className="text-center mb-8 max-w-sm">
        Scanning for your PantrySense Hub nearby...
      </ThemedText>

      <View className="flex-row space-x-1 mb-4">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
          />
        ))}
      </View>

      <ThemedText size="sm" variant="tertiary" className="text-center">
        This usually takes a few seconds
      </ThemedText>
    </View>
  );
  //   const ErrorView = () => (
  //     <View className="flex-1 justify-center items-center px-6">
  //       <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center mb-6">
  //         <Ionicons name="alert-circle-outline" size={32} color="#dc2626" />
  //       </View>

  //       <ThemedText size="xl" weight="bold" className="text-center mb-2">
  //         No Devices Found
  //       </ThemedText>
  //       <ThemedText variant="secondary" className="text-center mb-8 max-w-sm">
  //         {scanError ||
  //           "We couldn&apos;t find any PantrySense Hub devices in your area."}
  //       </ThemedText>

  //       <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 w-full max-w-sm">
  //         <View className="flex-row items-center mb-3">
  //           <Ionicons name="information-circle" size={16} color="#3b82f6" />
  //           <ThemedText
  //             size="sm"
  //             weight="semibold"
  //             className="text-blue-800 ml-2"
  //           >
  //             Quick Tips
  //           </ThemedText>
  //         </View>
  //         <View className="space-y-2">
  //           {[
  //             "Bluetooth is enabled on your phone",
  //             "PantrySense Hub is powered on and nearby",
  //             "Device is in pairing mode (LED blinking)",
  //           ].map((tip, index) => (
  //             <View key={index} className="flex-row items-start">
  //               <Ionicons
  //                 name="checkmark-circle"
  //                 size={14}
  //                 color="#8fb716"
  //                 className="mr-2 mt-0.5"
  //               />
  //               <ThemedText size="sm" variant="secondary" className="flex-1">
  //                 {tip}
  //               </ThemedText>
  //             </View>
  //           ))}
  //         </View>
  //       </View>

  //       <ThemedButton
  //         variant="secondary"
  //         size="lg"
  //         onPress={handleRefresh}
  //         className="w-full max-w-xs"
  //       >
  //         <View className="flex-row items-center justify-center">
  //           <Ionicons name="refresh" size={18} color="#0c0b0e" />
  //           <ThemedText
  //             size="base"
  //             weight="semibold"
  //             variant="secondary"
  //             className="ml-2"
  //           >
  //             Scan Again
  //           </ThemedText>
  //         </View>
  //       </ThemedButton>
  //     </View>
  //   );
  const ErrorView = () => {
    const getStatusMessage = (): {
      text: string;
      variant: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'warning' | 'error' | 'muted';
      size: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    } => {
      if (cooldown > 0 && hasScanned) {
        return {
          text: `Next scan available in ${Math.ceil(cooldown / 1000)} seconds`,
          variant: 'muted',
          size: 'sm',
        };
      }
      if (isScanning) {
        return {
          text: 'Scanning for devices...',
          variant: 'secondary',
          size: 'sm',
        };
      }
      return {
        text: 'Try scanning again to find nearby devices',
        variant: 'tertiary',
        size: 'sm',
      };
    };

    const statusMessage = getStatusMessage();

    return (
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center mb-6">
          <Ionicons name="alert-circle-outline" size={32} color="#dc2626" />
        </View>

        <ThemedText size="xl" weight="bold" className="text-center mb-2">
          No Devices Found
        </ThemedText>
        <ThemedText variant="secondary" className="text-center mb-8 max-w-sm">
          {scanError ||
            "We couldn't find any PantrySense Hub devices in your area."}
        </ThemedText>

        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 w-full max-w-sm">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={16} color="#3b82f6" />
            <ThemedText
              size="sm"
              weight="semibold"
              className="text-blue-800 ml-2"
            >
              Quick Tips
            </ThemedText>
          </View>
          <View className="space-y-2">
            {[
              "Bluetooth is enabled on your phone",
              "PantrySense Hub is powered on and nearby",
              "Device is in pairing mode (LED blinking)",
            ].map((tip, index) => (
              <View key={index} className="flex-row items-start">
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#8fb716"
                  className="mr-2 mt-0.5"
                />
                <ThemedText size="sm" variant="secondary" className="flex-1">
                  {tip}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <ThemedButton
          variant="secondary"
          size="lg"
          onPress={handleRefresh}
          className="w-full max-w-xs mb-3"
          disabled={isScanning || cooldown > 0}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="refresh" size={18} color="#0c0b0e" />
            <ThemedText size="base" weight="semibold" className="ml-2">
              Scan Again
            </ThemedText>
          </View>
        </ThemedButton>

        <ThemedText
          variant={statusMessage.variant}
          size={statusMessage.size}
          className="text-center"
        >
          {statusMessage.text}
        </ThemedText>
      </View>
    );
  };

  const SuccessView = () => (
    <View className="flex-1">
      <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
          </View>
          <View className="flex-1">
            <ThemedText
              size="base"
              weight="semibold"
              className="text-green-800"
            >
              {devices.length} Device{devices.length !== 1 ? "s" : ""} Found
            </ThemedText>
            <ThemedText
              size="sm"
              variant="secondary"
              className="text-green-700"
            >
              Ready to connect and configure
            </ThemedText>
          </View>
        </View>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeviceCard device={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <View className="border-t border-gray-100 pt-4 mt-4">
        <ThemedButton
          variant="secondary"
          onPress={handleRefresh}
          className="mb-3"
          disabled={isScanning || cooldown > 0}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="refresh" size={18} color="#8fb716" />
            <ThemedText variant="primary" weight="semibold" className="ml-2">
              Scan for More Devices
            </ThemedText>
          </View>
        </ThemedButton>

        {cooldown > 0 && (
          <ThemedText variant="secondary" className="text-center mt-2">
            Please wait {Math.ceil(cooldown / 1000)} seconds before scanning
            again.
          </ThemedText>
        )}

        <ThemedText size="sm" variant="tertiary" className="text-center">
          Tap any device above to begin setup
        </ThemedText>
      </View>
    </View>
  );

  const EmptyView = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-6">
        <Ionicons name="search" size={32} color="#9ca3af" />
      </View>

      <ThemedText size="xl" weight="bold" className="text-center mb-2">
        Let&apos;s Find Your Device
      </ThemedText>
      <ThemedText variant="secondary" className="text-center mb-8 max-w-sm">
        Tap the button below to search for your PantrySense Hub device
      </ThemedText>

      <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 w-full max-w-sm">
        <View className="flex-row items-center mb-3">
          <Ionicons name="information-circle" size={16} color="#3b82f6" />
          <ThemedText
            size="sm"
            weight="semibold"
            className="text-blue-800 ml-2"
          >
            Before You Start
          </ThemedText>
        </View>
        <View className="space-y-2">
          {[
            "Power on your PantrySense Hub device",
            "Look for a blinking LED (pairing mode)",
            "Keep your phone within 10 feet of the hub",
          ].map((step, index) => (
            <View key={index} className="flex-row items-start">
              <ThemedText
                size="sm"
                weight="semibold"
                className="text-blue-800 mr-2"
              >
                {index + 1}.
              </ThemedText>
              <ThemedText size="sm" variant="secondary" className="flex-1">
                {step}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      <ThemedButton
        variant="primary"
        size="lg"
        onPress={handleRefresh}
        className="w-full max-w-xs"
        disabled={isScanning || cooldown > 0}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="search" size={18} color="#ffffff" />
          <ThemedText size="base" weight="semibold" className="text-white ml-2">
            Start Scanning
          </ThemedText>
        </View>
      </ThemedButton>
      {isScanning ||
        (cooldown > 0 && (
          <ThemedText
            variant={cooldown > 0 && hasScanned ? "secondary" : "tertiary"}
            size={cooldown > 0 && hasScanned ? "base" : "sm"}
            className="text-center mt-2"
          >
            {(() => {
              if (cooldown > 0 && hasScanned) {
                return `Next scan available in ${Math.ceil(cooldown / 1000)} seconds`;
              }
              if (isScanning) {
                return "Scanning in progress...";
              }
              return "Running system checks... This usually takes a few moments";
            })()}
          </ThemedText>
        ))}
    </View>
  );

  const renderCurrentView = () => {
    switch (getCurrentViewState()) {
      case "scanning":
        return <ScanningView />;
      case "error":
        return <ErrorView />;
      case "success":
        return <SuccessView />;
      case "empty":
      default:
        return <EmptyView />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ThemedContainer className="flex-1">
        <View className="flex-1 px-6 pt-6 pb-6">
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-primary rounded-xl mb-4 items-center justify-center">
              <Ionicons name="leaf" size={24} color="#FFFFFF" />
            </View>
            <ThemedText size="xl" weight="bold" className="text-center mb-2">
              Device Discovery
            </ThemedText>
            <ThemedText variant="secondary" className="text-center max-w-sm">
              Connect your SmartPot Master to get started with automated Pantry
              Management
            </ThemedText>
          </View>

          {renderCurrentView()}
        </View>
      </ThemedContainer>
    </SafeAreaView>
  );
}
