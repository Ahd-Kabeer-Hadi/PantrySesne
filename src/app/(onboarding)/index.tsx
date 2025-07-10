import * as React from "react";
import { useState } from "react";
import { useBLE } from "../../hooks/useBLE";
import ErrorDisplay, { ErrorDrawerModal } from "../../components/ErrorDisplay";
import MotherHubSetupScreen from "../../screens/MotherHubSetupScreen";
import MotherHubDiscoveryScreen from "../../screens/MotherHubDiscoveryScreen";
import WelcomeScreen from "../../screens/WelcomeScreen";
import MotherHubWifiSetupScreen from "../../screens/MotherHubWifiSetupScreen";
import { useBLEStore, BLEDevice } from "../../stores/bleStore";
import { parseError } from "../../utils/errorHandler";
import { provisionWiFi as provisionWiFiService, disconnectDevice as disconnectDeviceService } from "../../services/ble";
import { View } from "react-native";
import { ThemedText } from "../../components/ThemedComponents";
import { ThemedButton } from "../../components/ThemedComponents";
import { Ionicons } from "@expo/vector-icons";

const STEPS = ["welcome", "scan", "wifi", "provisioning"] as const;
type Step = typeof STEPS[number];

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("welcome");
  const [wifiLoading, setWifiLoading] = useState(false);
  const [provisionStatus, setProvisionStatus] = useState<"connecting" | "success" | "error">("connecting");
  const [showError, setShowError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastDevice, setLastDevice] = useState<BLEDevice | null>(null);
  const [connectingAttempt, setConnectingAttempt] = useState<number | null>(null);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [maxTimeout, setMaxTimeout] = useState(120000); // 2 minutes
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // BLE actions from useBLE
  const {
    isReady,
    isScanning,
    devices,
    selectedDevice,
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice,
  } = useBLE();

  // BLE state and onboarding from store
  const {
    provisioning,
    error,
    setError,
    provisioningDevices,
    setSelectedDevice,
    selectedDevice: storeSelectedDevice,
    persistOnboardingComplete,
  } = useBLEStore();

  const handleError = (errorMessage: string) => {
    const appError = parseError(errorMessage);
    setError(appError.userMessage);
    setShowError(true);
  };

  if (step === "welcome") {
    return <WelcomeScreen onNext={() => setStep("scan")} />;
  }

  if (step === "scan") {
    return (
      <>
        <ErrorDrawerModal
          visible={!!error}
          error={error ? parseError(error) : null}
          onDismiss={() => {
            setShowError(false);
            setError(null);
          }}
          onRetry={() => {
            setShowError(false);
            setError(null);
            startScan();
          }}
        />
        {isConnecting ? (
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-20 h-20 rounded-full bg-primary/10 justify-center items-center mb-6 relative">
              <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute" />
              {/* Animated dots for subtle progress */}
              <View className="flex-row absolute bottom-[-24px] left-1/2 -translate-x-1/2">
                <View className="w-2 h-2 bg-primary rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0ms' }} />
                <View className="w-2 h-2 bg-primary/60 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '200ms' }} />
                <View className="w-2 h-2 bg-primary/40 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '400ms' }} />
              </View>
            </View>
            <ThemedText size="xl" weight="bold" className="mb-2 text-center">Hang tight!{"\n"}We're connecting to your PantrySense Hub…</ThemedText>
            <ThemedText variant="secondary" className="text-center max-w-xs mb-4">
              This usually takes less than a minute.
            </ThemedText>
            <ThemedButton
              variant="secondary"
              onPress={() => {
                setIsConnecting(false);
                setConnectionError("Connection cancelled by user.");
              }}
              className="px-6 py-2 rounded-lg mt-2"
            >
              Cancel
            </ThemedButton>
          </View>
        ) : connectionError && lastDevice ? (
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-20 h-20 rounded-full bg-muted justify-center items-center mb-6 relative">
              <Ionicons name="sad-outline" size={48} color="#b8b8b8" />
            </View>
            <ThemedText size="xl" weight="bold" className="mb-2 text-center text-error">Couldn't connect to your PantrySense Hub.</ThemedText>
            <ThemedText variant="secondary" className="text-center max-w-xs mb-4">
              Let's try a few things to help you connect:
              {"\n• Make sure your Hub is powered on and nearby."}
              {"\n• Bluetooth is enabled on your phone."}
              {"\n• Try moving closer to the device."}
            </ThemedText>
            <View className="flex-row space-x-2">
              <ThemedButton
                variant="primary"
                onPress={async () => {
                  setConnectionError(null);
                  setIsConnecting(true);
                  setWifiLoading(true);
                  const connected = await connectToDevice(lastDevice.raw.id);
                  setWifiLoading(false);
                  setIsConnecting(false);
                  if (connected) {
                    setStep("wifi");
                  } else {
                    setConnectionError("Couldn't connect. Please try again.");
                  }
                }}
                className="px-6 py-2 rounded-lg"
              >
                Try Again
              </ThemedButton>
              <ThemedButton
                variant="secondary"
                onPress={() => {
                  setConnectionError(null);
                  setLastDevice(null);
                  setShowError(false);
                  setError(null);
                  startScan();
                }}
                className="px-6 py-2 rounded-lg"
              >
                Back to Devices
              </ThemedButton>
            </View>
          </View>
        ) : (
          <MotherHubDiscoveryScreen
            onRefresh={startScan}
            onSelect={async (deviceInfo: BLEDevice) => {
              if (isConnecting) return;
              setIsConnecting(true);
              setSelectedDevice(deviceInfo.raw);
              setLastDevice(deviceInfo);
              setWifiLoading(true);
              const connected = await connectToDevice(deviceInfo.raw.id);
              setWifiLoading(false);
              setIsConnecting(false);
              if (connected) {
                setStep("wifi");
              } else {
                setConnectionError("Connection Failed. Please try again.");
              }
            }}
          />
        )}
      </>
    );
  }

  if (step === "wifi") {
    return (
      <>
        <ErrorDrawerModal
          visible={!!error}
          error={error ? parseError(error) : null}
          onDismiss={() => {
            setShowError(false);
            setError(null);
          }}
        />
        <MotherHubWifiSetupScreen
          loading={wifiLoading || provisioning === "pending"}
          onSubmit={async (ssid, password) => {
            setWifiLoading(true);
            setProvisionStatus("connecting");
            try {
              if (!storeSelectedDevice) throw new Error("No device selected");
              const ok = await provisionWiFiService(storeSelectedDevice, ssid, password);
              setStep("provisioning");
              setProvisionStatus(ok ? "success" : "error");
            } catch (e) {
              setProvisionStatus("error");
              handleError("WiFi Provisioning Failed");
            } finally {
              setWifiLoading(false);
            }
          }}
        />
      </>
    );
  }

  if (step === "provisioning") {
    return (
      <MotherHubSetupScreen
        status={provisionStatus}
        onRetry={() => {
          setProvisionStatus("connecting");
          setStep("wifi");
        }}
        onAddContainers={() => {
          if (provisionStatus === "success") {
            persistOnboardingComplete();
          }
        }}
        onDone={async () => {
          if (provisionStatus === "success") {
            persistOnboardingComplete();
          } else {
            setStep("welcome");
          }
          setSelectedDevice(null);
          if (storeSelectedDevice) {
            await disconnectDeviceService(storeSelectedDevice);
          }
        }}
      />
    );
  }

  return null;
}
