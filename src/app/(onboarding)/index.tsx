import { useState } from "react";
import { useBLE } from "../../hooks/useBLE";
import ErrorDisplay from "../../components/ErrorDisplay";
import ProvisioningScreen from "../../screens/ProvisioningScreen";
import ScanMotherScreen from "../../screens/ScanMotherScreen";
import WelcomeScreen from "../../screens/WelcomeScreen";
import WifiCredentialsScreen from "../../screens/WifiCredentialsScreen";
import { useBLEStore } from "../../stores/bleStore";
import { parseError } from "../../utils/errorHandler";

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
    provisioningDevices,
    scanForProvisioningDevices,
    connectToProvisioningDevice,
    connectedProvisioningDevice,
    provisionWiFi,
    
    // Scanning states
    scanningProvisioning,
    
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
        {showError && error && (
          <ErrorDisplay
            error={getParsedError()!}
            onDismiss={() => {
              setShowError(false);
              setError(null);
            }}
            onRetry={() => {
              setShowError(false);
              setError(null);
              scanForProvisioningDevices();
            }}
            compact
          />
        )}
        <ScanMotherScreen
          devices={provisioningDevices.map(d => ({ 
            id: d.id, 
            name: d.name,
            rssi: d.device.rssi || -70,
            isConnectable: d.device.isConnectable || true
          }))}
          scanning={scanningProvisioning}
          error={error}
          onRefresh={scanForProvisioningDevices}
          onSelect={async (deviceInfo) => {
            const provisioningDevice = provisioningDevices.find(d => d.id === deviceInfo.id);
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
        {showError && error && (
          <ErrorDisplay
            error={getParsedError()!}
            onDismiss={() => {
              setShowError(false);
              setError(null);
            }}
            compact
          />
        )}
        <WifiCredentialsScreen
          onSubmit={async (ssid, password) => {
            setWifiLoading(true);
            setProvisionStatus("connecting");
            
            const ok = await provisionWiFi(ssid, password);
            setWifiLoading(false);
            setStep("provisioning");
            setProvisionStatus(ok ? "success" : "error");
            
            // On success, persist onboarding completion
            if (ok) {
              persistOnboardingComplete();
            }
          }}
          loading={wifiLoading || provisioning === "pending"}
        />
      </>
    );
  }
  
  if (step === "provisioning") {
    return (
      <ProvisioningScreen
        status={provisionStatus}
        onRetry={() => {
          setProvisionStatus("connecting");
          setStep("wifi");
        }}
        onDone={async () => {
          setStep("welcome");
          setSelectedDevice(null);
          await disconnect();
        }}
      />
    );
  }
  
  return null;
} 