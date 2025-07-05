import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedContainer, ThemedCard, ThemedText, ThemedButton, ThemedInput } from "../components/ThemedComponents";

interface WifiCredentialsScreenProps {
  onSubmit: (ssid: string, password: string) => void;
  loading: boolean;
}

export default function WifiCredentialsScreen({ onSubmit, loading }: WifiCredentialsScreenProps) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (ssid.trim() && password.trim()) {
      onSubmit(ssid.trim(), password);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ThemedContainer className="flex-1">
        <View className="flex-1 px-6 pt-8 pb-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary rounded-2xl shadow-lg mb-6 items-center justify-center">
              <Ionicons name="wifi" size={36} color="#FFFFFF" />
            </View>
            <ThemedText size="2xl" weight="bold" className="text-center mb-3">
              Connect to WiFi
            </ThemedText>
            <ThemedText variant="secondary" className="text-center max-w-xs">
              Enter your WiFi credentials to connect your device
            </ThemedText>
          </View>

          {/* WiFi Form */}
          <View className="flex-1">
            <ThemedCard variant="elevated" className="p-6">
              <ThemedText size="lg" weight="semibold" className="mb-6">
                Network Information
              </ThemedText>
              
              {/* SSID Input */}
              <View className="mb-6">
                <ThemedText size="sm" weight="medium" className="mb-2">
                  Network Name (SSID)
                </ThemedText>
                <ThemedInput
                  placeholder="Enter your WiFi network name"
                  value={ssid}
                  onChangeText={setSsid}
                  className="mb-1"
                />
                <ThemedText size="xs" variant="tertiary">
                  This is the name of your WiFi network
                </ThemedText>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <ThemedText size="sm" weight="medium" className="mb-2">
                  Password
                </ThemedText>
                <View className="relative">
                  <ThemedInput
                    placeholder="Enter your WiFi password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                </View>
                <ThemedText size="xs" variant="tertiary">
                  Your WiFi password is encrypted and secure
                </ThemedText>
              </View>

              {/* Security Note */}
              <View className="bg-primary/10 rounded-lg p-4 mb-6">
                <View className="flex-row items-start">
                  <Ionicons name="shield-checkmark" size={20} color="#8fb716" className="mr-3 mt-0.5" />
                  <View className="flex-1">
                    <ThemedText size="sm" weight="medium" variant="primary" className="mb-1">
                      Secure Connection
                    </ThemedText>
                    <ThemedText size="xs" variant="secondary">
                      Your credentials are encrypted and only used to connect your PantrySense device to your WiFi network.
                    </ThemedText>
                  </View>
                </View>
              </View>
            </ThemedCard>

            {/* Submit Button */}
            <View className="space-y-4">
              <ThemedButton
                variant="primary"
                size="lg"
                onPress={handleSubmit}
                disabled={loading || !ssid.trim() || !password.trim()}
                className="shadow-lg"
              >
                <View className="flex-row items-center justify-center">
                  {loading ? (
                    <>
                      <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <ThemedText variant="inverse" weight="semibold">Connecting...</ThemedText>
                    </>
                  ) : (
                    <>
                      <ThemedText size="lg" weight="semibold" variant="inverse" className="mr-2">
                        Connect Device
                      </ThemedText>
                      <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                    </>
                  )}
                </View>
              </ThemedButton>
              
              <ThemedText size="sm" variant="tertiary" className="text-center">
                This will connect your device to your WiFi network
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedContainer>
    </SafeAreaView>
  );
} 