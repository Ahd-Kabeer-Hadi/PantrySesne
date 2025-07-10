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

const STEPS = ["welcome", "scan", "wifi", "provisioning"] as const;
type Step = typeof STEPS[number];

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("welcome");
  const [wifiLoading, setWifiLoading] = useState(false);
  const [provisionStatus, setProvisionStatus] = useState<"connecting" | "success" | "error">("connecting");
  const [showError, setShowError] = useState(false);

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
        <MotherHubDiscoveryScreen
          onRefresh={startScan}
          onSelect={async (deviceInfo: BLEDevice) => {
            setSelectedDevice(deviceInfo.raw);
            setWifiLoading(true);
            const connected = await connectToDevice(deviceInfo.raw.id);
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
