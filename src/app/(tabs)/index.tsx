import React from "react";
import { View, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemedContainer, ThemedCard, ThemedText, ThemedButton, ThemedBadge } from "../../components/ThemedComponents";

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
    case "good": return "#8fb716"; // Primary green
    case "low": return "#e4fa5b"; // Secondary green
    case "empty": return "#dc2626"; // Error red
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
      <ThemedCard
        key={device.id}
        variant="elevated"
        className="mb-4"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View 
              className="w-12 h-12 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: `${statusColor}20` }}
            >
              <Ionicons name="restaurant" size={24} color={statusColor} />
            </View>
            <View>
              <ThemedText size="lg" weight="semibold" className="mb-1">
                {device.name}
              </ThemedText>
              <ThemedText size="sm" variant="secondary">
                {device.lastUpdated}
              </ThemedText>
            </View>
          </View>
          <ThemedBadge 
            variant={device.status === "good" ? "success" : device.status === "low" ? "warning" : "error"}
            size="sm"
          >
            {statusText}
          </ThemedBadge>
        </View>

        {/* Weight Progress */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <ThemedText size="sm" variant="secondary">
              {device.weight}g / {device.maxWeight}g
            </ThemedText>
            <ThemedText size="sm" weight="semibold">
              {percentage.toFixed(0)}%
            </ThemedText>
          </View>
          <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
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
        <View className="flex-row">
          <TouchableOpacity className="flex-1 bg-primary/10 rounded-lg py-3 px-4 mr-2">
            <View className="flex-row items-center justify-center">
              <Ionicons name="notifications" size={16} color="#8fb716" className="mr-2" />
              <ThemedText size="sm" weight="medium" variant="primary">Set Alert</ThemedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-secondary/10 rounded-lg py-3 px-4">
            <View className="flex-row items-center justify-center">
              <Ionicons name="add" size={16} color="#e4fa5b" className="mr-2" />
              <ThemedText size="sm" weight="medium" variant="secondary">Add Item</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedCard>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <ThemedContainer className="flex-1">
        <ScrollView 
          className="flex-1 px-6 pt-8"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <ThemedText size="3xl" weight="bold" className="mb-2">
                  Your Pantry
                </ThemedText>
                <ThemedText size="lg" variant="secondary">
                  {mockDevices.length} containers monitored
                </ThemedText>
              </View>
              <TouchableOpacity className="w-14 h-14 bg-primary rounded-2xl items-center justify-center">
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Status Summary */}
            <ThemedCard variant="elevated" className="p-6">
              <ThemedText size="lg" weight="semibold" className="mb-4">
                Quick Overview
              </ThemedText>
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <View className="w-16 h-16 bg-success/20 rounded-2xl items-center justify-center mb-3">
                    <Ionicons name="checkmark-circle" size={32} color="#8fb716" />
                  </View>
                  <ThemedText size="xl" weight="bold" className="mb-1">1</ThemedText>
                  <ThemedText size="sm" variant="secondary">Well Stocked</ThemedText>
                </View>
                <View className="items-center flex-1">
                  <View className="w-16 h-16 bg-warning/20 rounded-2xl items-center justify-center mb-3">
                    <Ionicons name="warning" size={32} color="#e4fa5b" />
                  </View>
                  <ThemedText size="xl" weight="bold" className="mb-1">1</ThemedText>
                  <ThemedText size="sm" variant="secondary">Running Low</ThemedText>
                </View>
                <View className="items-center flex-1">
                  <View className="w-16 h-16 bg-error/20 rounded-2xl items-center justify-center mb-3">
                    <Ionicons name="close-circle" size={32} color="#dc2626" />
                  </View>
                  <ThemedText size="xl" weight="bold" className="mb-1">1</ThemedText>
                  <ThemedText size="sm" variant="secondary">Empty</ThemedText>
                </View>
              </View>
            </ThemedCard>
          </View>

          {/* Devices List */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <ThemedText size="xl" weight="semibold">
                Smart Containers
              </ThemedText>
              <TouchableOpacity className="flex-row items-center">
                <ThemedText size="sm" variant="primary" weight="medium" className="mr-2">View All</ThemedText>
                <Ionicons name="chevron-forward" size={16} color="#8fb716" />
              </TouchableOpacity>
            </View>
            
            {mockDevices.map(renderDeviceCard)}
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <ThemedText size="xl" weight="semibold" className="mb-4">
              Quick Actions
            </ThemedText>
            <View className="flex-row">
              <ThemedCard variant="elevated" className="flex-1 p-6 mr-3">
                <View className="items-center">
                  <View className="w-16 h-16 bg-primary/20 rounded-2xl items-center justify-center mb-4">
                    <Ionicons name="scan" size={32} color="#8fb716" />
                  </View>
                  <ThemedText size="base" weight="semibold" className="text-center">
                    Add Container
                  </ThemedText>
                </View>
              </ThemedCard>
              
              <ThemedCard variant="elevated" className="flex-1 p-6">
                <View className="items-center">
                  <View className="w-16 h-16 bg-secondary/20 rounded-2xl items-center justify-center mb-4">
                    <Ionicons name="notifications" size={32} color="#e4fa5b" />
                  </View>
                  <ThemedText size="base" weight="semibold" className="text-center">
                    Manage Alerts
                  </ThemedText>
                </View>
              </ThemedCard>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View className="h-6" />
        </ScrollView>
      </ThemedContainer>
    </SafeAreaView>
  );
} 