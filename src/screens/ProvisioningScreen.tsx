import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedContainer, ThemedCard, ThemedText, ThemedButton } from "../components/ThemedComponents";

interface ProvisioningScreenProps {
  status: "connecting" | "success" | "error";
  onRetry: () => void;
  onDone: () => void;
}

export default function ProvisioningScreen({ status, onRetry, onDone }: ProvisioningScreenProps) {
  const renderConnectingState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-primary/20 rounded-3xl items-center justify-center mb-8">
        <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </View>
      <ThemedText size="2xl" weight="bold" className="text-center mb-4">
        Connecting Device
      </ThemedText>
      <ThemedText variant="secondary" className="text-center leading-relaxed max-w-sm mb-8">
        Please wait while we connect your device to WiFi and set up the connection.
      </ThemedText>
      
      {/* Progress Steps */}
      <View className="w-full max-w-sm space-y-4 mb-8">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
          <ThemedText variant="secondary" className="flex-1">
            Device discovered
          </ThemedText>
        </View>
        
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
          <ThemedText variant="secondary" className="flex-1">
            WiFi credentials sent
          </ThemedText>
        </View>
        
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-primary/20 rounded-full items-center justify-center mr-3">
            <View className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </View>
          <ThemedText variant="secondary" className="flex-1">
            Connecting to WiFi...
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderSuccessState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-success/20 rounded-3xl items-center justify-center mb-8">
        <Ionicons name="checkmark-circle" size={64} color="#8fb716" />
      </View>
      <ThemedText size="2xl" weight="bold" className="text-center mb-4">
        Successfully Connected!
      </ThemedText>
      <ThemedText variant="secondary" className="text-center leading-relaxed max-w-sm mb-8">
        Your device is now connected to WiFi and ready to monitor your pantry.
      </ThemedText>
      
      {/* Success Details */}
      <ThemedCard variant="elevated" className="p-6 mb-8">
        <View className="flex-row items-center mb-3">
          <Ionicons name="checkmark-circle" size={24} color="#8fb716" className="mr-3" />
          <ThemedText size="lg" weight="semibold" variant="success">WiFi Connected</ThemedText>
        </View>
        <ThemedText size="sm" variant="secondary">
          Your device can now communicate with the cloud and send you smart alerts.
        </ThemedText>
      </ThemedCard>
      
      <ThemedButton
        variant="success"
        size="lg"
        onPress={onDone}
        className="shadow-lg"
      >
        <View className="flex-row items-center justify-center">
          <ThemedText size="lg" weight="semibold" variant="inverse" className="mr-2">
            Continue to Dashboard
          </ThemedText>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </View>
      </ThemedButton>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-error/20 rounded-3xl items-center justify-center mb-8">
        <Ionicons name="close-circle" size={64} color="#dc2626" />
      </View>
      <ThemedText size="2xl" weight="bold" className="text-center mb-4">
        Connection Failed
      </ThemedText>
      <ThemedText variant="secondary" className="text-center leading-relaxed max-w-sm mb-8">
        We couldn't connect your device to WiFi. This might be due to incorrect credentials or network issues.
      </ThemedText>
      
      {/* Error Details */}
      <ThemedCard variant="elevated" className="p-6 mb-8">
        <View className="flex-row items-center mb-3">
          <Ionicons name="warning" size={24} color="#dc2626" className="mr-3" />
          <ThemedText size="lg" weight="semibold" variant="error">Connection Error</ThemedText>
        </View>
        <ThemedText size="sm" variant="secondary" className="mb-3">
          Possible causes:
        </ThemedText>
        <View className="space-y-2">
          <View className="flex-row items-start">
            <View className="w-2 h-2 bg-error rounded-full mt-2 mr-3" />
            <ThemedText size="sm" variant="secondary" className="flex-1">
              Incorrect WiFi password
            </ThemedText>
          </View>
          <View className="flex-row items-start">
            <View className="w-2 h-2 bg-error rounded-full mt-2 mr-3" />
            <ThemedText size="sm" variant="secondary" className="flex-1">
              Network not in range
            </ThemedText>
          </View>
          <View className="flex-row items-start">
            <View className="w-2 h-2 bg-error rounded-full mt-2 mr-3" />
            <ThemedText size="sm" variant="secondary" className="flex-1">
              Device connection timeout
            </ThemedText>
          </View>
        </View>
      </ThemedCard>
      
      <View className="space-y-3 w-full">
        <ThemedButton
          variant="primary"
          size="lg"
          onPress={onRetry}
          className="shadow-lg"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="refresh" size={20} color="#FFFFFF" className="mr-2" />
            <ThemedText size="lg" weight="semibold" variant="inverse">
              Try Again
            </ThemedText>
          </View>
        </ThemedButton>
        
        <ThemedButton
          variant="ghost"
          onPress={onDone}
          className="shadow-lg"
        >
          <ThemedText variant="primary" weight="semibold" className="text-center">
            Skip for Now
          </ThemedText>
        </ThemedButton>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <ThemedContainer className="flex-1">
        <View className="flex-1 px-6 pt-8 pb-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className={`w-20 h-20 rounded-2xl shadow-lg mb-6 items-center justify-center ${
              status === "success" ? "bg-success" : 
              status === "error" ? "bg-error" : "bg-primary"
            }`}>
              <Ionicons 
                name={
                  status === "success" ? "checkmark" : 
                  status === "error" ? "close" : "wifi"
                } 
                size={36} 
                color="#FFFFFF" 
              />
            </View>
            <ThemedText size="2xl" weight="bold" className="text-center mb-3">
              {status === "success" ? "Setup Complete" : 
               status === "error" ? "Setup Failed" : "Setting Up"}
            </ThemedText>
            <ThemedText variant="secondary" className="text-center max-w-xs">
              {status === "success" ? "Your device is ready to use" : 
               status === "error" ? "Let's try again" : "Connecting your device"}
            </ThemedText>
          </View>

          {/* Content */}
          {status === "connecting" && renderConnectingState()}
          {status === "success" && renderSuccessState()}
          {status === "error" && renderErrorState()}
        </View>
      </ThemedContainer>
    </SafeAreaView>
  );
} 