import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedContainer, ThemedCard, ThemedText, ThemedButton } from "../../components/ThemedComponents";

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "low" as const,
    title: "Low Stock Alert",
    message: "Rice is running low in Container A. Consider restocking soon.",
    container: "Container A",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "empty" as const,
    title: "Container Empty",
    message: "Sugar container is completely empty. Please refill to continue monitoring.",
    container: "Container B",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    type: "success" as const,
    title: "Setup Complete",
    message: "Your new smart container has been successfully configured and is now monitoring.",
    container: "Container C",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "info" as const,
    title: "Weekly Summary",
    message: "Your pantry usage summary for this week is ready. Check your dashboard for details.",
    container: "All Containers",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "low" as const,
    title: "Low Stock Alert",
    message: "Flour is running low in Container D. Consider restocking soon.",
    container: "Container D",
    time: "3 hours ago",
    read: true,
  },
];

const getNotificationColor = (type: "low" | "empty" | "info" | "success") => {
  switch (type) {
    case "low": return "#e4fa5b"; // Warning yellow
    case "empty": return "#dc2626"; // Error red
    case "info": return "#8fb716"; // Primary green
    case "success": return "#8fb716"; // Success green
    default: return "#b8b8b8"; // Accent gray
  }
};

const getNotificationIcon = (type: "low" | "empty" | "info" | "success") => {
  switch (type) {
    case "low": return "warning" as const;
    case "empty": return "close-circle" as const;
    case "info": return "information-circle" as const;
    case "success": return "checkmark-circle" as const;
    default: return "notifications" as const;
  }
};

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [showRead, setShowRead] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const filteredNotifications = showRead 
    ? mockNotifications 
    : mockNotifications.filter(n => !n.read);

  const renderNotification = (notification: typeof mockNotifications[0]) => {
    const color = getNotificationColor(notification.type);
    const icon = getNotificationIcon(notification.type);

    return (
      <ThemedCard
        key={notification.id}
        variant="elevated"
        className={`mb-3 ${
          !notification.read ? 'border-l-4' : ''
        }`}
        style={{
          borderLeftColor: !notification.read ? color : 'transparent',
        }}
      >
        <View className="flex-row items-start">
          <View 
            className="w-10 h-10 rounded-xl items-center justify-center mr-3 mt-1"
            style={{ backgroundColor: `${color}20` }}
          >
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <ThemedText size="base" weight="semibold">
                {notification.title}
              </ThemedText>
              {!notification.read && (
                <View className="w-2 h-2 bg-primary rounded-full" />
              )}
            </View>
            <ThemedText size="sm" variant="secondary" className="mb-2 leading-relaxed">
              {notification.message}
            </ThemedText>
            <View className="flex-row items-center justify-between">
              <ThemedText size="xs" variant="secondary">
                {notification.container}
              </ThemedText>
              <ThemedText size="xs" variant="secondary">
                {notification.time}
              </ThemedText>
            </View>
          </View>
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
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <ThemedText size="2xl" weight="bold">
                  Notifications
                </ThemedText>
                <ThemedText variant="secondary">
                  Stay updated on your pantry
                </ThemedText>
              </View>
              <TouchableOpacity className="w-12 h-12 bg-primary rounded-2xl items-center justify-center shadow-md">
                <Ionicons name="settings" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <ThemedCard variant="elevated" className="p-1">
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setShowRead(true)}
                  className={`flex-1 py-2 px-4 rounded-xl ${
                    showRead ? 'bg-primary' : 'bg-transparent'
                  }`}
                >
                  <ThemedText 
                    size="sm" 
                    weight="medium" 
                    variant={showRead ? "inverse" : "secondary"}
                    className="text-center"
                  >
                    All ({mockNotifications.length})
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowRead(false)}
                  className={`flex-1 py-2 px-4 rounded-xl ${
                    !showRead ? 'bg-primary' : 'bg-transparent'
                  }`}
                >
                  <ThemedText 
                    size="sm" 
                    weight="medium" 
                    variant={!showRead ? "inverse" : "secondary"}
                    className="text-center"
                  >
                    Unread ({mockNotifications.filter(n => !n.read).length})
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedCard>
          </View>

          {/* Notifications List */}
          <View className="mb-6">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(renderNotification)
            ) : (
              <View className="flex-1 justify-center items-center py-12">
                <View className="w-24 h-24 bg-accent/20 rounded-2xl items-center justify-center mb-6">
                  <Ionicons name="notifications-off" size={48} color="#b8b8b8" />
                </View>
                <ThemedText size="lg" weight="semibold" className="text-center mb-2">
                  No notifications
                </ThemedText>
                <ThemedText variant="secondary" className="text-center leading-relaxed max-w-sm">
                  {showRead 
                    ? "You're all caught up! Check back later for updates."
                    : "No unread notifications at the moment."
                  }
                </ThemedText>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          {filteredNotifications.length > 0 && (
            <View className="mb-8">
              <View className="flex-row space-x-3">
                <ThemedCard variant="elevated" className="flex-1 p-4">
                  <View className="items-center">
                    <View className="w-12 h-12 bg-primary/20 rounded-xl items-center justify-center mb-3">
                      <Ionicons name="checkmark-done" size={24} color="#8fb716" />
                    </View>
                    <ThemedText size="sm" weight="semibold" className="text-center">
                      Mark All Read
                    </ThemedText>
                  </View>
                </ThemedCard>
                
                <ThemedCard variant="elevated" className="flex-1 p-4">
                  <View className="items-center">
                    <View className="w-12 h-12 bg-accent/20 rounded-xl items-center justify-center mb-3">
                      <Ionicons name="trash" size={24} color="#b8b8b8" />
                    </View>
                    <ThemedText size="sm" weight="semibold" className="text-center">
                      Clear All
                    </ThemedText>
                  </View>
                </ThemedCard>
              </View>
            </View>
          )}

          {/* Bottom Spacing */}
          <View className="h-6" />
        </ScrollView>
      </ThemedContainer>
    </SafeAreaView>
  );
} 