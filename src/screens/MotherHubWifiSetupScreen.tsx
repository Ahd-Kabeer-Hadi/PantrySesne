import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedContainer, ThemedCard, ThemedText, ThemedButton, ThemedInput } from "../components/ThemedComponents";

interface MotherHubWifiSetupScreenProps {
  onSubmit: (ssid: string, password: string) => void;
  loading: boolean;
  onBack?: () => void;
}

export default function MotherHubWifiSetupScreen({ onSubmit, loading, onBack }: MotherHubWifiSetupScreenProps) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const passwordInputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    if (!ssid.trim() || !password.trim()) {
      setFormError("Please fill in both fields to continue.");
      return;
    }
    setFormError(null);
    Keyboard.dismiss();
    onSubmit(ssid.trim(), password);
  };

  const handleBack = () => {
    Keyboard.dismiss();
    onBack?.();
  };

  const handleSSIDSubmit = () => {
    passwordInputRef.current?.focus();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{ flex: 1 }}
      >
        {/* Main Content Area */}
        <View className="flex-1">
          {/* Scrollable Content */}
          <ScrollView 
            className="flex-1" 
            contentContainerStyle={{ 
              flexGrow: 1,
              paddingBottom: 120 // Extra padding to ensure content doesn't get hidden behind buttons
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <View className="px-6 pt-8">
              {/* Header */}
              <View className="items-center mb-8">
                <View className="w-16 h-16 bg-primary rounded-full mb-4 items-center justify-center">
                  <Ionicons name="wifi" size={28} color="#FFFFFF" />
                </View>
                <ThemedText size="2xl" weight="bold" className="text-center mb-2">
                  Connect Your Hub
                </ThemedText>
                <ThemedText variant="secondary" className="text-center max-w-sm leading-relaxed">
                  Let's get your PantrySense hub online so it can keep track of your essentials
                </ThemedText>
              </View>

              {/* WiFi Form */}
              <ThemedCard variant="elevated" className="p-6 mb-6">
                {/* SSID Input */}
                <View className="mb-6">
                  <ThemedText size="base" weight="medium" className="mb-3">
                    WiFi Network
                  </ThemedText>
                  <ThemedInput
                    placeholder="Your WiFi network name"
                    value={ssid}
                    onChangeText={text => {
                      setSsid(text);
                      if (formError) setFormError(null);
                    }}
                    className="text-base"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      // Focus password field when SSID is submitted
                      // This will be handled by the password input's ref
                    }}
                  />
                </View>

                {/* Password Input */}
                <View className="mb-4">
                  <ThemedText size="base" weight="medium" className="mb-3">
                    Password
                  </ThemedText>
                  <View className="relative">
                    <ThemedInput
                      placeholder="Your WiFi password"
                      value={password}
                      onChangeText={text => {
                        setPassword(text);
                        if (formError) setFormError(null);
                      }}
                      secureTextEntry={!showPassword}
                      className="pr-12 text-base"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off" : "eye"} 
                        size={20} 
                        color="#9ca3af" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Error Message */}
                {formError && (
                  <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <ThemedText size="sm" className="text-center" variant="error">
                      {formError}
                    </ThemedText>
                  </View>
                )}

                {/* Simple Security Note */}
                <View className="flex-row items-center bg-green-50 rounded-lg p-3">
                  <Ionicons name="lock-closed" size={16} color="#059669" className="mr-2" />
                  <ThemedText size="md" variant="success" >
                    Your information is secure and encrypted
                  </ThemedText>
                </View>
              </ThemedCard>

              {/* Status Text */}
              <View className="items-center mb-8">
                <ThemedText size="sm" variant="tertiary" className="text-center mb-2">
                  {loading 
                    ? "Setting up your connection..." 
                    : "This usually takes just a few seconds"
                  }
                </ThemedText>
                {/* Form Progress Indicator */}
                <View className="flex-row space-x-2">
                  <View className={`w-3 h-3 rounded-full ${ssid.trim() ? 'bg-success' : 'bg-gray-300'}`} />
                  <View className={`w-3 h-3 rounded-full ${password.trim() ? 'bg-success' : 'bg-gray-300'}`} />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Action Buttons - Always Visible and Keyboard Safe */}
          <View 
            className="bg-white border-t border-gray-100 px-6 py-4"
            style={{
              // Ensure buttons stay above keyboard
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            }}
          >
            <View className="space-y-3">
              <ThemedButton
                variant={ssid.trim() && password.trim() ? "primary" : "secondary"}
                size="lg"
                onPress={handleSubmit}
                disabled={loading || !ssid.trim() || !password.trim()}
                className={loading ? 'opacity-75' : ''}
              >
                <View className="flex-row items-center justify-center py-1">
                  {loading ? (
                    <>
                      <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      <ThemedText variant="inverse" weight="bold" size="lg">Connecting...</ThemedText>
                    </>
                  ) : (
                    <>
                      <Ionicons name="wifi" size={24} color="#FFFFFF" className="mr-3" />
                      <ThemedText size="lg" weight="bold" variant="inverse">
                        Connect Hub
                      </ThemedText>
                      <Ionicons name="arrow-forward" size={24} color="#FFFFFF" className="ml-3" />
                    </>
                  )}
                </View>
              </ThemedButton>
              
              {onBack && (
                <ThemedButton
                  variant="ghost"
                  size="lg"
                  onPress={handleBack}
                  className="flex-row items-center justify-center"
                >
                  <Ionicons name="arrow-back" size={18} color="#8fb716" className="mr-2" />
                  <ThemedText variant="primary" weight="medium" size="base">Back</ThemedText>
                </ThemedButton>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}