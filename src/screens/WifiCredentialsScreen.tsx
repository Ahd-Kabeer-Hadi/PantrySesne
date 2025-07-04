import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WifiCredentialsScreenProps {
  onSubmit: (ssid: string, password: string) => void;
  loading: boolean;
}

export default function WifiCredentialsScreen({ onSubmit, loading }: WifiCredentialsScreenProps) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!ssid.trim()) {
      Alert.alert("WiFi Name Required", "Please enter your WiFi network name.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("WiFi Password Required", "Please enter your WiFi password.");
      return;
    }
    onSubmit(ssid.trim(), password.trim());
  };

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
          <View className="w-16 h-16 bg-primary rounded-2xl shadow-soft mb-4 items-center justify-center">
            <Ionicons name="wifi" size={28} color="#FFFFFF" />
          </View>
          <Text className="text-2xl font-bold text-primary text-center mb-2">
            Connect to WiFi
          </Text>
          <Text className="text-base text-muted-foreground text-center">
            Your device needs internet to work
          </Text>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center">
          <View className="bg-white/80 rounded-3xl p-6 shadow-soft backdrop-blur-md">
            <Text className="text-lg font-semibold text-foreground text-center mb-6">
              Enter your WiFi credentials
            </Text>
            
            {/* WiFi Network Name */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-2">
                WiFi Network Name (SSID)
              </Text>
              <View className="relative">
                <TextInput
                  value={ssid}
                  onChangeText={setSsid}
                  placeholder="Enter your WiFi name"
                  placeholderTextColor="#5C5C5C"
                  className="bg-white/60 rounded-2xl px-4 py-3 text-base border border-border/30 focus:border-primary/50"
                  style={{
                    shadowColor: '#497174',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <View className="absolute right-3 top-3">
                  <Ionicons name="wifi" size={20} color="#497174" />
                </View>
              </View>
            </View>

            {/* WiFi Password */}
            <View className="mb-8">
              <Text className="text-sm font-medium text-foreground mb-2">
                WiFi Password
              </Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your WiFi password"
                  placeholderTextColor="#5C5C5C"
                  secureTextEntry={!showPassword}
                  className="bg-white/60 rounded-2xl px-4 py-3 text-base border border-border/30 focus:border-primary/50 pr-12"
                  style={{
                    shadowColor: '#497174',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                  disabled={loading}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#497174" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Info Card */}
            <View className="bg-primary/10 rounded-2xl p-4 mb-6 border border-primary/20">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#497174" className="mr-3 mt-0.5" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-primary mb-1">
                    Your data is secure
                  </Text>
                  <Text className="text-xs text-muted-foreground leading-relaxed">
                    Your WiFi credentials are sent directly to your device via Bluetooth 
                    and are not stored on our servers.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !ssid.trim() || !password.trim()}
            className={`rounded-2xl py-4 px-6 shadow-soft ${
              loading || !ssid.trim() || !password.trim()
                ? 'bg-muted/50'
                : 'bg-primary'
            }`}
            style={{
              shadowColor: '#497174',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-center">
              {loading ? (
                <>
                  <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <Text className="text-white font-semibold">Connecting...</Text>
                </>
              ) : (
                <>
                  <Text className="text-white text-lg font-semibold mr-2">
                    Connect Device
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </View>
          </TouchableOpacity>
          
          <Text className="text-xs text-muted-foreground text-center">
            This will connect your device to your WiFi network
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
} 