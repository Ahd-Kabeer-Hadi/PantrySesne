import { useState } from "react";
import { Alert } from "react-native";
import { useBLE } from "../../hooks/useBLE";
import ProvisioningScreen from "../../screens/ProvisioningScreen";
import ScanMotherScreen from "../../screens/ScanMotherScreen";
import WelcomeScreen from "../../screens/WelcomeScreen";
import WifiCredentialsScreen from "../../screens/WifiCredentialsScreen";
import { useBLEStore } from "../../stores/bleStore";

// Steps: welcome -> scan -> wifi -> provisioning
const STEPS = ["welcome", "scan", "wifi", "provisioning"] as const;
type Step = typeof STEPS[number];

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("welcome");
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [wifiLoading, setWifiLoading] = useState(false);
  const [provisionStatus, setProvisionStatus] = useState<"pending" | "success" | "error">("pending");

  const {
    devices,
    scanForDevices,
    connectToDevice,
    connectedDevice,
    provisionDevice,
    provisioning,
    disconnect,
    error,
    setError,
  } = useBLE();
  const { persistOnboardingComplete } = useBLEStore();

  // Handle BLE errors
  if (error) {
    Alert.alert("Bluetooth Error", error, [
      { text: "OK", onPress: () => setError(null) }
    ]);
  }

  // Step rendering
  if (step === "welcome") {
    return <WelcomeScreen onNext={() => setStep("scan")} />;
  }
  if (step === "scan") {
    return (
      <ScanMotherScreen
        devices={devices.map(d => ({ id: d.id, name: d.name }))}
        scanning={false}
        onRefresh={scanForDevices}
        onSelect={async (deviceInfo) => {
          const bleDevice = devices.find(d => d.id === deviceInfo.id);
          if (!bleDevice) return;
          setSelectedDevice(bleDevice);
          setWifiLoading(true);
          const connected = await connectToDevice(bleDevice.id);
          setWifiLoading(false);
          if (connected) {
            setStep("wifi");
          } else {
            Alert.alert("Connection Failed", "Could not connect to device. Please try again.");
          }
        }}
      />
    );
  }
  if (step === "wifi") {
    return (
      <WifiCredentialsScreen
        onSubmit={async (ssid, password) => {
          setWifiLoading(true);
          setProvisionStatus("pending");
          const ok = await provisionDevice(ssid, password);
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
    );
  }
  if (step === "provisioning") {
    return (
      <ProvisioningScreen
        status={provisionStatus}
        onRetry={() => {
          setProvisionStatus("pending");
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