import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedContainer, ThemedCard, ThemedText, ThemedButton } from "../../components/ThemedComponents";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [emptyAlerts, setEmptyAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Would you like to contact our support team?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "WhatsApp", 
          onPress: () => {
            // In a real app, this would open WhatsApp with the support number
            Alert.alert("Support", "Contact us at: +91 7034522688");
          }
        }
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset Onboarding",
      "This will reset your device setup. You'll need to go through the setup process again. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: () => {
            // In a real app, this would reset onboarding state
            Alert.alert("Reset Complete", "Onboarding has been reset.");
          }
        }
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <ThemedCard
      variant="elevated"
      onPress={onPress}
      className="mb-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-primary/20 rounded-xl items-center justify-center mr-3">
            <Ionicons name={icon as any} size={20} color="#8fb716" />
          </View>
          <View className="flex-1">
            <ThemedText size="base" weight="semibold">
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText size="sm" variant="secondary" className="mt-1">
                {subtitle}
              </ThemedText>
            )}
          </View>
        </View>
        {rightElement || (
          onPress && <Ionicons name="chevron-forward" size={20} color="#8fb716" />
        )}
      </View>
    </ThemedCard>
  );

  return (
    <SafeAreaView className="flex-1">
      <ThemedContainer className="flex-1">
        <ScrollView 
          className="flex-1 px-6 pt-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <ThemedText size="2xl" weight="bold">
                  Settings
                </ThemedText>
                <ThemedText variant="secondary">
                  Customize your experience
                </ThemedText>
              </View>
              <View className="w-12 h-12 bg-primary rounded-2xl items-center justify-center">
                <Ionicons name="settings" size={24} color="#FFFFFF" />
              </View>
            </View>

            {/* User Profile Card */}
            <ThemedCard variant="elevated" className="p-4">
              <View className="flex-row items-center">
                <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="person" size={32} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <ThemedText size="lg" weight="semibold">
                    Your Pantry
                  </ThemedText>
                  <ThemedText size="sm" variant="secondary">
                    3 containers • Last updated 2 min ago
                  </ThemedText>
                </View>
                <TouchableOpacity className="w-8 h-8 bg-primary/20 rounded-lg items-center justify-center">
                  <Ionicons name="pencil" size={16} color="#8fb716" />
                </TouchableOpacity>
              </View>
            </ThemedCard>
          </View>

          {/* Notifications Section */}
          <View className="mb-6">
            <ThemedText size="lg" weight="semibold" className="mb-4">
              Notifications
            </ThemedText>
            
            {renderSettingItem(
              "notifications",
              "Push Notifications",
              "Receive alerts on your device",
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#E0E0E0", true: "#8fb716" }}
                thumbColor={notificationsEnabled ? "#FFFFFF" : "#FFFFFF"}
              />
            )}
            
            {renderSettingItem(
              "warning",
              "Low Stock Alerts",
              "Get notified when items are running low",
              <Switch
                value={lowStockAlerts}
                onValueChange={setLowStockAlerts}
                trackColor={{ false: "#E0E0E0", true: "#8fb716" }}
                thumbColor={lowStockAlerts ? "#FFFFFF" : "#FFFFFF"}
              />
            )}
            
            {renderSettingItem(
              "close-circle",
              "Empty Alerts",
              "Get notified when containers are empty",
              <Switch
                value={emptyAlerts}
                onValueChange={setEmptyAlerts}
                trackColor={{ false: "#E0E0E0", true: "#8fb716" }}
                thumbColor={emptyAlerts ? "#FFFFFF" : "#FFFFFF"}
              />
            )}
          </View>

          {/* Appearance Section */}
          <View className="mb-6">
            <ThemedText size="lg" weight="semibold" className="mb-4">
              Appearance
            </ThemedText>
            
            {renderSettingItem(
              "moon",
              "Dark Mode",
              "Switch between light and dark themes",
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#E0E0E0", true: "#8fb716" }}
                thumbColor={darkMode ? "#FFFFFF" : "#FFFFFF"}
              />
            )}
          </View>

          {/* Device Management Section */}
          <View className="mb-6">
            <ThemedText size="lg" weight="semibold" className="mb-4">
              Device Management
            </ThemedText>
            
            {renderSettingItem(
              "bluetooth",
              "Connected Devices",
              "Manage your smart containers",
              undefined,
              () => Alert.alert("Devices", "Device management coming soon!")
            )}
            
            {renderSettingItem(
              "wifi",
              "WiFi Settings",
              "Configure network connection",
              undefined,
              () => Alert.alert("WiFi", "WiFi settings coming soon!")
            )}
            
            {renderSettingItem(
              "refresh",
              "Reset Onboarding",
              "Start device setup from scratch",
              undefined,
              handleResetOnboarding
            )}
          </View>

          {/* Support Section */}
          <View className="mb-6">
            <ThemedText size="lg" weight="semibold" className="mb-4">
              Support & Help
            </ThemedText>
            
            {renderSettingItem(
              "help-circle",
              "Help Center",
              "Find answers to common questions",
              undefined,
              () => Alert.alert("Help", "Help center coming soon!")
            )}
            
            {renderSettingItem(
              "chatbubble",
              "Contact Support",
              "Get help from our team",
              undefined,
              handleContactSupport
            )}
            
            {renderSettingItem(
              "document-text",
              "Privacy Policy",
              "Read our privacy policy",
              undefined,
              () => Alert.alert("Privacy", "Privacy policy coming soon!")
            )}
            
            {renderSettingItem(
              "document-text",
              "Terms of Service",
              "Read our terms of service",
              undefined,
              () => Alert.alert("Terms", "Terms of service coming soon!")
            )}
          </View>

          {/* App Info Section */}
          <View className="mb-8">
            <ThemedText size="lg" weight="semibold" className="mb-4">
              About
            </ThemedText>
            
            {renderSettingItem(
              "information-circle",
              "App Version",
              "PantrySense v1.0.0",
              undefined,
              () => Alert.alert("Version", "PantrySense v1.0.0")
            )}
            
            {renderSettingItem(
              "heart",
              "Made with ❤️",
              "By the PantrySense team",
              undefined,
              () => Alert.alert("Thanks!", "Thank you for using PantrySense!")
            )}
          </View>

          {/* Bottom Spacing */}
          <View className="h-6" />
        </ScrollView>
      </ThemedContainer>
    </SafeAreaView>
  );
} 