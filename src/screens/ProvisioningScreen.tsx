import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProvisioningScreenProps {
  status: "pending" | "success" | "error";
  onRetry: () => void;
  onDone: () => void;
}

export default function ProvisioningScreen({ status, onRetry, onDone }: ProvisioningScreenProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => setShowSuccess(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const renderPendingState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-primary/20 rounded-3xl items-center justify-center mb-8 breathing">
        <Ionicons name="wifi" size={64} color="#497174" />
      </View>
      <Text className="text-2xl font-bold text-foreground text-center mb-4">
        Connecting to WiFi...
      </Text>
      <Text className="text-base text-muted-foreground text-center leading-relaxed max-w-sm mb-8">
        Your device is connecting to your WiFi network. This may take a few moments.
      </Text>
      
      {/* Progress Indicators */}
      <View className="flex-row space-x-2 mb-8">
        <View className="w-3 h-3 bg-primary rounded-full animate-pulse" />
        <View className="w-3 h-3 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <View className="w-3 h-3 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </View>
      
      <View className="bg-white/60 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
        <Text className="text-sm text-muted-foreground text-center">
          Please wait while we establish the connection
        </Text>
      </View>
    </View>
  );

  const renderSuccessState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-success/20 rounded-3xl items-center justify-center mb-8 scale-in">
        <Ionicons name="checkmark-circle" size={64} color="#7FC8A9" />
      </View>
      <Text className="text-2xl font-bold text-foreground text-center mb-4">
        Successfully Connected!
      </Text>
      <Text className="text-base text-muted-foreground text-center leading-relaxed max-w-sm mb-8">
        Your device is now connected to WiFi and ready to monitor your pantry.
      </Text>
      
      {/* Success Details */}
      <View className="bg-success/10 rounded-2xl p-4 mb-8 border border-success/20">
        <View className="flex-row items-center mb-2">
          <Ionicons name="checkmark-circle" size={20} color="#7FC8A9" className="mr-2" />
          <Text className="text-sm font-semibold text-success">WiFi Connected</Text>
        </View>
        <Text className="text-xs text-muted-foreground">
          Your device can now communicate with the cloud and send you smart alerts.
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={onDone}
        className="bg-success rounded-2xl py-4 px-8 shadow-soft"
        style={{
          shadowColor: '#7FC8A9',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center">
          <Text className="text-white text-lg font-semibold mr-2">
            Continue to Dashboard
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <View className="w-32 h-32 bg-error/20 rounded-3xl items-center justify-center mb-8">
        <Ionicons name="close-circle" size={64} color="#E36565" />
      </View>
      <Text className="text-2xl font-bold text-foreground text-center mb-4">
        Connection Failed
      </Text>
      <Text className="text-base text-muted-foreground text-center leading-relaxed max-w-sm mb-8">
        We couldn't connect your device to WiFi. This could be due to incorrect credentials or network issues.
      </Text>
      
      {/* Error Details */}
      <View className="bg-error/10 rounded-2xl p-4 mb-8 border border-error/20">
        <View className="flex-row items-start mb-2">
          <Ionicons name="information-circle" size={20} color="#E36565" className="mr-2 mt-0.5" />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-error mb-1">
              Possible Issues
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              • Incorrect WiFi password{"\n"}
              • Network is not 2.4GHz (some devices don't support 5GHz){"\n"}
              • Device is too far from router{"\n"}
              • Network has special security settings
            </Text>
          </View>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View className="space-y-3 w-full">
        <TouchableOpacity
          onPress={onRetry}
          className="bg-primary rounded-2xl py-4 px-6 shadow-soft"
          style={{
            shadowColor: '#497174',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="refresh" size={20} color="#FFFFFF" className="mr-2" />
            <Text className="text-white text-lg font-semibold">
              Try Again
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={onDone}
          className="bg-white/60 rounded-2xl py-3 px-6 shadow-soft backdrop-blur-sm"
        >
          <Text className="text-primary font-semibold text-center">
            Skip for Now
          </Text>
        </TouchableOpacity>
      </View>
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
        <View className="absolute top-1/3 left-1/4 w-16 h-16 bg-success/8 rounded-full blur-md" />
      </View>

      <View className="flex-1 px-6 pt-8 pb-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className={`w-16 h-16 rounded-2xl shadow-soft mb-4 items-center justify-center ${
            status === "success" ? "bg-success" : 
            status === "error" ? "bg-error" : "bg-primary"
          }`}>
            <Ionicons 
              name={
                status === "success" ? "checkmark" : 
                status === "error" ? "close" : "wifi"
              } 
              size={28} 
              color="#FFFFFF" 
            />
          </View>
          <Text className="text-2xl font-bold text-primary text-center mb-2">
            {status === "success" ? "Setup Complete" : 
             status === "error" ? "Setup Failed" : "Setting Up"}
          </Text>
          <Text className="text-base text-muted-foreground text-center">
            {status === "success" ? "Your device is ready to use" : 
             status === "error" ? "Let's try again" : "Connecting your device"}
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          {status === "pending" && renderPendingState()}
          {status === "success" && renderSuccessState()}
          {status === "error" && renderErrorState()}
        </View>
      </View>
    </SafeAreaView>
  );
} 