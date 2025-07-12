import * as React from "react";
import { useState, useEffect } from "react";
import { useBLE } from "../../hooks/useBLE";
import ErrorDisplay, { ErrorDrawerModal } from "../../components/ErrorDisplay";
import MotherHubSetupScreen from "../../screens/MotherHubSetupScreen";
import MotherHubDiscoveryScreen from "../../screens/MotherHubDiscoveryScreen";
import WelcomeScreen from "../../screens/WelcomeScreen";
import MotherHubWifiSetupScreen from "../../screens/MotherHubWifiSetupScreen";
import { useBLEStore, BLEDevice } from "../../stores/bleStore";
import { parseError } from "../../utils/errorHandler";
import { provisionWiFi as provisionWiFiService, disconnectDevice as disconnectDeviceService } from "../../services/ble";
import { View, Animated, Easing } from "react-native";
import { ThemedText } from "../../components/ThemedComponents";
import { ThemedButton } from "../../components/ThemedComponents";
import { Ionicons } from "@expo/vector-icons";
import { ConnectionErrorScreen, ConnectionLoadingScreen } from "@/src/components/onboarding/MotherConnectionLoader";

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
          <ConnectionLoadingScreen
            onCancel={() => {
              setIsConnecting(false);
              setConnectionError("Connection cancelled by user.");
            }}
          />
        ) : connectionError && lastDevice ? (
          <ConnectionErrorScreen
            onRetry={async () => {
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
            onBackToDevices={() => {
              setConnectionError(null);
              setLastDevice(null);
              setShowError(false);
              setError(null);
              startScan();
            }}
          />
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
          onRetry={async () => {
            setShowError(false);
            setError(null);
            // Retry provisioning logic could be added here
          }}
        />
        <MotherHubWifiSetupScreen
          loading={wifiLoading || provisioning === "pending"}
          onSubmit={async (ssid, password) => {
            setWifiLoading(true);
            setProvisionStatus("connecting");
            
            // Retry logic for provisioning
            let retryCount = 0;
            const maxRetries = 2;
            
            while (retryCount <= maxRetries) {
              try {
                if (!storeSelectedDevice) throw new Error("No device selected");
                
                console.log(`🔄 Starting WiFi provisioning (attempt ${retryCount + 1}/${maxRetries + 1})...`);
                const ok = await provisionWiFiService(storeSelectedDevice, ssid, password);
                
                if (ok) {
                  console.log("✅ Provisioning completed successfully");
                  setStep("provisioning");
                  setProvisionStatus("success");
                  break; // Success, exit retry loop
                } else {
                  console.log("❌ Provisioning returned false");
                  throw new Error("Device did not respond to provisioning");
                }
              } catch (e) {
                console.error(`❌ Provisioning error (attempt ${retryCount + 1}):`, e);
                
                if (retryCount === maxRetries) {
                  // Final attempt failed
                  setStep("provisioning");
                  setProvisionStatus("error");
                  
                  // Provide more specific error handling
                  const errorMessage = e instanceof Error ? e.message : String(e);
                  if (errorMessage.includes('timeout')) {
                    handleError("Connection timeout - please ensure your device is nearby and try again");
                  } else if (errorMessage.includes('not found')) {
                    handleError("Device not found - please restart your PantrySense Hub and try again");
                  } else if (errorMessage.includes('permission')) {
                    handleError("Bluetooth permission issue - please check app permissions in settings");
                  } else if (errorMessage.includes('write failed')) {
                    handleError("Write operation failed - please ensure your device is in range and try again. If the problem persists, restart your PantrySense Hub.");
                  } else if (errorMessage.includes('not connected')) {
                    handleError("Device connection lost - please reconnect to your device and try again");
                  } else if (errorMessage.includes('already configured')) {
                    handleError("Your PantrySense Hub is already configured! To reconfigure WiFi, please:\n\n1. Unplug your PantrySense Hub\n2. Wait 10 seconds\n3. Plug it back in\n4. Try connecting again");
                  } else if (errorMessage.includes('does not have provisioning service')) {
                    handleError("Your PantrySense Hub is not in setup mode. Please:\n\n1. Unplug your PantrySense Hub\n2. Wait 10 seconds\n3. Plug it back in\n4. Try connecting again");
                  } else if (errorMessage.includes('unknown configuration')) {
                    handleError("Your PantrySense Hub has an unknown configuration. Please:\n\n1. Unplug your PantrySense Hub\n2. Wait 10 seconds\n3. Plug it back in\n4. Try connecting again");
                  } else {
                    handleError(`WiFi Provisioning Failed: ${errorMessage}`);
                  }
                  break;
                } else {
                  // Wait before retry
                  console.log(`⏳ Waiting 3 seconds before retry...`);
                  await new Promise(resolve => setTimeout(resolve, 3000));
                  retryCount++;
                }
              }
            }
            
            setWifiLoading(false);
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