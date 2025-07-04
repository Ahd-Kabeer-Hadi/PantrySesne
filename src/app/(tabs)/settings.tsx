import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <TouchableOpacity
      onPress={onPress}
      className="bg-white/80 rounded-2xl p-4 mb-3 shadow-soft backdrop-blur-sm active:scale-95 transition-all duration-200"
      style={{
        shadowColor: '#497174',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-primary/20 rounded-xl items-center justify-center mr-3">
            <Ionicons name={icon as any} size={20} color="#497174" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement || (
          onPress && <Ionicons name="chevron-forward" size={20} color="#497174" />
        )}
      </View>
    </TouchableOpacity>
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

      <ScrollView 
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-foreground">
                Settings
              </Text>
              <Text className="text-base text-muted-foreground">
                Customize your experience
              </Text>
            </View>
            <View className="w-12 h-12 bg-primary rounded-2xl items-center justify-center shadow-soft">
              <Ionicons name="settings" size={24} color="#FFFFFF" />
            </View>
          </View>

          {/* User Profile Card */}
          <View className="bg-white/80 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl items-center justify-center mr-4">
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  Your Pantry
                </Text>
                <Text className="text-sm text-muted-foreground">
                  3 containers • Last updated 2 min ago
                </Text>
              </View>
              <TouchableOpacity className="w-8 h-8 bg-primary/20 rounded-lg items-center justify-center">
                <Ionicons name="pencil" size={16} color="#497174" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Notifications
          </Text>
          
          {renderSettingItem(
            "notifications",
            "Push Notifications",
            "Receive alerts on your device",
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#E0E0E0", true: "#497174" }}
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
              trackColor={{ false: "#E0E0E0", true: "#497174" }}
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
              trackColor={{ false: "#E0E0E0", true: "#497174" }}
              thumbColor={emptyAlerts ? "#FFFFFF" : "#FFFFFF"}
            />
          )}
        </View>

        {/* Appearance Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Appearance
          </Text>
          
          {renderSettingItem(
            "moon",
            "Dark Mode",
            "Switch between light and dark themes",
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#E0E0E0", true: "#497174" }}
              thumbColor={darkMode ? "#FFFFFF" : "#FFFFFF"}
            />
          )}
        </View>

        {/* Device Management Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Device Management
          </Text>
          
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
          <Text className="text-lg font-semibold text-foreground mb-4">
            Support & Help
          </Text>
          
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
          <Text className="text-lg font-semibold text-foreground mb-4">
            About
          </Text>
          
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
    </SafeAreaView>
  );
} 