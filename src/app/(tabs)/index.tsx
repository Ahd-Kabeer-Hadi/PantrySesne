import React from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Mock data - replace with real data from your store
const mockDevices = [
  {
    id: "1",
    name: "Coffee Container",
    weight: 85,
    maxWeight: 100,
    status: "good" as const,
    lastUpdated: "2 min ago",
  },
  {
    id: "2", 
    name: "Sugar Jar",
    weight: 15,
    maxWeight: 50,
    status: "low" as const,
    lastUpdated: "5 min ago",
  },
  {
    id: "3",
    name: "Flour Container", 
    weight: 0,
    maxWeight: 200,
    status: "empty" as const,
    lastUpdated: "1 hour ago",
  },
];

const getStatusColor = (status: "good" | "low" | "empty") => {
  switch (status) {
    case "good": return "#7FC8A9";
    case "low": return "#FFB344";
    case "empty": return "#E36565";
  }
};

const getStatusIcon = (status: "good" | "low" | "empty") => {
  switch (status) {
    case "good": return "checkmark-circle";
    case "low": return "warning";
    case "empty": return "close-circle";
  }
};

const getStatusText = (status: "good" | "low" | "empty") => {
  switch (status) {
    case "good": return "Well Stocked";
    case "low": return "Running Low";
    case "empty": return "Empty";
  }
};

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const renderDeviceCard = (device: typeof mockDevices[0]) => {
    const statusColor = getStatusColor(device.status);
    const statusIcon = getStatusIcon(device.status);
    const statusText = getStatusText(device.status);
    const percentage = (device.weight / device.maxWeight) * 100;

    return (
      <TouchableOpacity
        key={device.id}
        className="bg-white/80 rounded-2xl p-4 mb-4 shadow-soft backdrop-blur-sm active:scale-95 transition-all duration-200"
        style={{
          shadowColor: '#497174',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View 
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: `${statusColor}20` }}
            >
              <Ionicons name="restaurant" size={20} color={statusColor} />
            </View>
            <View>
              <Text className="text-base font-semibold text-foreground">
                {device.name}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {device.lastUpdated}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Ionicons name={statusIcon} size={20} color={statusColor} className="mr-1" />
            <Text 
              className="text-xs font-medium"
              style={{ color: statusColor }}
            >
              {statusText}
            </Text>
          </View>
        </View>

        {/* Weight Bar */}
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-muted-foreground">
              {device.weight}g / {device.maxWeight}g
            </Text>
            <Text className="text-sm font-medium text-foreground">
              {percentage.toFixed(0)}%
            </Text>
          </View>
          <View className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: statusColor,
              }}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row space-x-2">
          <TouchableOpacity className="flex-1 bg-primary/10 rounded-xl py-2 px-3">
            <View className="flex-row items-center justify-center">
              <Ionicons name="notifications" size={16} color="#497174" className="mr-1" />
              <Text className="text-xs font-medium text-primary">Set Alert</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-accent/10 rounded-xl py-2 px-3">
            <View className="flex-row items-center justify-center">
              <Ionicons name="add" size={16} color="#F2B6A0" className="mr-1" />
              <Text className="text-xs font-medium text-accent">Add Item</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
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

      <ScrollView 
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-foreground">
                Your Pantry
              </Text>
              <Text className="text-base text-muted-foreground">
                {mockDevices.length} containers monitored
              </Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-primary rounded-2xl items-center justify-center shadow-soft">
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Status Summary */}
          <View className="bg-white/80 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Quick Overview
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <View className="w-12 h-12 bg-success/20 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="checkmark-circle" size={24} color="#7FC8A9" />
                </View>
                <Text className="text-lg font-bold text-foreground">1</Text>
                <Text className="text-xs text-muted-foreground">Well Stocked</Text>
              </View>
              <View className="items-center">
                <View className="w-12 h-12 bg-warning/20 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="warning" size={24} color="#FFB344" />
                </View>
                <Text className="text-lg font-bold text-foreground">1</Text>
                <Text className="text-xs text-muted-foreground">Running Low</Text>
              </View>
              <View className="items-center">
                <View className="w-12 h-12 bg-error/20 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="close-circle" size={24} color="#E36565" />
                </View>
                <Text className="text-lg font-bold text-foreground">1</Text>
                <Text className="text-xs text-muted-foreground">Empty</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Devices List */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-foreground">
              Smart Containers
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm text-primary font-medium mr-1">View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#497174" />
            </TouchableOpacity>
          </View>
          
          {mockDevices.map(renderDeviceCard)}
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-white/80 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
              <View className="items-center">
                <View className="w-12 h-12 bg-primary/20 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="scan" size={24} color="#497174" />
                </View>
                <Text className="text-sm font-semibold text-foreground text-center">
                  Add Container
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 bg-white/80 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
              <View className="items-center">
                <View className="w-12 h-12 bg-accent/20 rounded-xl items-center justify-center mb-3">
                  <Ionicons name="notifications" size={24} color="#F2B6A0" />
                </View>
                <Text className="text-sm font-semibold text-foreground text-center">
                  Manage Alerts
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
} 