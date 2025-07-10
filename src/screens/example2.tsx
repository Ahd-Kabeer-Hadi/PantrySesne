import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedContainer, ThemedCard, ThemedText, ThemedButton } from "../components/ThemedComponents";

interface MotherHubSetupScreenProps {
  status: "connecting" | "success" | "error";
  onRetry: () => void;
  onDone: () => void;
  onAddContainers?: () => void;
}

export default function MotherHubSetupScreen({ 
  status, 
  onRetry, 
  onDone, 
  onAddContainers 
}: MotherHubSetupScreenProps) {
  const renderConnectingState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-primary/20 rounded-3xl items-center justify-center mb-8">
        <View className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </View>
      <ThemedText size="2xl" weight="bold" className="text-center mb-4">
        Connecting Mother Hub
      </ThemedText>
      <ThemedText variant="secondary" className="text-center leading-relaxed max-w-sm mb-8">
        Please wait while we connect your SmartPot Master to WiFi and set up the connection.
      </ThemedText>
      
      {/* Progress Steps */}
      <View className="w-full max-w-sm space-y-4 mb-8">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
          <ThemedText variant="secondary" className="flex-1">
            Mother hub discovered
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
      
      
      {/* Success Details */}
      <ThemedCard variant="elevated" className="p-6 mb-8">
        <View className="flex-row items-center mb-3">
          <Ionicons name="checkmark-circle" size={24} color="#8fb716" className="mr-3" />
          <ThemedText size="lg" weight="semibold" variant="success">WiFi Connected</ThemedText>
        </View>
        
        <View className="bg-primary/10 rounded-lg p-3">
          <ThemedText size="sm" weight="medium" variant="primary" className="mb-1">
            Next Step: Container Pairing
          </ThemedText>
          <ThemedText size="xs" variant="secondary">
            Pair your smart containers with this mother hub for complete pantry monitoring.
          </ThemedText>
        </View>
      </ThemedCard>
      
      {/* Two Options */}
      <View className="space-y-3 w-full flex flex-col justify-end  gap-4 max-w-sm">
        <ThemedButton
          variant="primary"
          size="lg"
          onPress={onAddContainers || onDone}
          className=""
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="add-circle" size={20} color="#FFFFFF" className="mr-2" />
            <ThemedText size="lg" weight="semibold" variant="inverse">
              Add Containers
            </ThemedText>
          </View>
        </ThemedButton>
        
        <ThemedButton
          variant="secondary"
          size="lg"
          onPress={onDone}
          className=""
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="home" size={20} color="#8fb716" className="mr-2" />
            <ThemedText size="lg" weight="semibold" variant="primary">
              Go to Dashboard
            </ThemedText>
          </View>
        </ThemedButton>
        
        <ThemedText size="sm" variant="tertiary" className="text-center mt-4">
          You can add containers later from the dashboard
        </ThemedText>
      </View>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-accent/20 rounded-3xl items-center justify-center mb-8">
        <Ionicons name="wifi" size={64} color="#b8b8b8" />
      </View>
      <ThemedText size="2xl" weight="bold" className="text-center mb-4">
        Connection Not Established
      </ThemedText>
      <ThemedText variant="secondary" className="text-center leading-relaxed max-w-sm mb-8">
        We couldn't connect your mother hub to WiFi. Let's check your settings and try again.
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
              Double-check your WiFi password
            </ThemedText>
          </View>
          <View className="flex-row items-start">
            <View className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
            <ThemedText size="sm" variant="secondary" className="flex-1">
              Make sure your WiFi network is in range
            </ThemedText>
          </View>
          <View className="flex-row items-start">
            <View className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
            <ThemedText size="sm" variant="secondary" className="flex-1">
              Check that your mother hub is powered on
            </ThemedText>
          </View>
        </View>
      </View>
      
      <ThemedButton
        variant="secondary"
        size="lg"
        onPress={onRetry}
        className=""
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

  return (
    <SafeAreaView className="flex-1">
      <ThemedContainer className="flex-1">
        <View className="flex-1 px-6 pt-8 pb-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className={`w-20 h-20 rounded-2xl mb-6 items-center justify-center ${
              status === "success" ? "bg-success" : 
              status === "error" ? "bg-accent" : "bg-primary"
            }`}>
              <Ionicons 
                name={
                  status === "success" ? "checkmark" : 
                  status === "error" ? "wifi" : "wifi"
                } 
                size={36} 
                color="#FFFFFF" 
              />
            </View>
            <ThemedText size="2xl" weight="bold" className="text-center mb-3">
              {status === "success" ? "Mother Hub Ready" : 
               status === "error" ? "Connection Issue" : "Connecting Mother Hub"}
            </ThemedText>
            <ThemedText variant="secondary" className="text-center max-w-xs">
              {status === "success" ? "Your mother hub is connected and ready for containers" : 
               status === "error" ? "Let's check your settings and try again" : "Setting up your mother hub connection"}
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