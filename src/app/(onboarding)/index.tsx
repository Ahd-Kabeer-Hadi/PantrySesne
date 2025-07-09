import { useState, useEffect } from "react";
import { useBLE } from "../../hooks/useBLE";
import ErrorDisplay from "../../components/ErrorDisplay";
import MotherHubSetupScreen from "../../screens/MotherHubSetupScreen";
import MotherHubDiscoveryScreen from "../../screens/MotherHubDiscoveryScreen";
import WelcomeScreen from "../../screens/WelcomeScreen";
import MotherHubWifiSetupScreen from "../../screens/MotherHubWifiSetupScreen";
import { useBLEStore } from "../../stores/bleStore";
import { parseError } from "../../utils/errorHandler";
import { ErrorDrawerModal } from "../../components/ErrorDisplay";

// Steps: welcome -> scan -> wifi -> provisioning
const STEPS = ["welcome", "scan", "wifi", "provisioning"] as const;
type Step = typeof STEPS[number];

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("welcome");
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [wifiLoading, setWifiLoading] = useState(false);
  const [provisionStatus, setProvisionStatus] = useState<"connecting" | "success" | "error">("connecting");
  const [showError, setShowError] = useState(false);

  const {
    // Provisioning devices (SmartPotMaster)
    provisioningDevices: bleProvisioningDevices,
    scanForProvisioningDevices,
    connectToProvisioningDevice,
    connectedProvisioningDevice,
    provisionWiFi,
    
    // General
    provisioning,
    disconnect,
    error,
    setError,
    getParsedError,
  } = useBLE();
  
  const { persistOnboardingComplete } = useBLEStore();

  // Handle BLE errors with user-friendly display
  const handleError = (errorMessage: string) => {
    const appError = parseError(errorMessage);
    setError(appError.userMessage);
    setShowError(true);
  };

  // Step rendering
  if (step === "welcome") {
    return <WelcomeScreen onNext={() => setStep("scan")} />;
  }
  
  if (step === "scan") {
    return (
      <>
        <ErrorDrawerModal
          visible={!!error}
          error={getParsedError()}
          onDismiss={() => {
            setShowError(false);
            setError(null);
          }}
          onRetry={() => {
            setShowError(false);
            setError(null);
            scanForProvisioningDevices();
          }}
        />
        <MotherHubDiscoveryScreen
          devices={Array.isArray(bleProvisioningDevices) ? bleProvisioningDevices.map((d: any) => ({ 
            id: d.id, 
            name: d.name,
            rssi: d.device.rssi || -70,
            isConnectable: d.device.isConnectable || true
          })) : []}
          scanning={false}
          onRefresh={scanForProvisioningDevices}
          onSelect={async (deviceInfo) => {
            const provisioningDevice = Array.isArray(bleProvisioningDevices) ? bleProvisioningDevices.find((d: any) => d.id === deviceInfo.id) : undefined;
            if (!provisioningDevice) return;
            setSelectedDevice(provisioningDevice);
            setWifiLoading(true);
            const connected = await connectToProvisioningDevice(provisioningDevice.id);
            setWifiLoading(false);
            if (connected) {
              setStep("wifi");
            } else {
              handleError("Connection Failed");
            }
          }}
        />
      </>
    );
  }
  
  if (step === "wifi") {
    return (
      <>
        <ErrorDrawerModal
          visible={!!error}
          error={getParsedError()}
          onDismiss={() => {
            setShowError(false);
            setError(null);
          }}
        />
        <MotherHubWifiSetupScreen
          onSubmit={async (ssid, password) => {
            setWifiLoading(true);
            setProvisionStatus("connecting");
            const ok = await provisionWiFi(ssid, password);
            setWifiLoading(false);
            setStep("provisioning");
            setProvisionStatus(ok ? "success" : "error");
            // Don't persist onboarding completion here - wait for user to click "Continue"
          }}
          loading={wifiLoading || provisioning === "pending"}
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
          // TODO: Navigate to container pairing flow
          console.log('🔧 TODO: Navigate to container pairing flow');
          // For now, just go to dashboard
          if (provisionStatus === "success") {
            persistOnboardingComplete();
          }
        }}
        onDone={async () => {
          // Only persist onboarding completion on success
          if (provisionStatus === "success") {
            persistOnboardingComplete();
            // Don't set step - let routing logic handle redirect to dashboard
          } else {
            // On error, go back to welcome
            setStep("welcome");
          }
          setSelectedDevice(null);
          await disconnect();
        }}
      />
    );
  }
  
  return null;
} 