import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "low" as const,
    title: "Sugar Jar Running Low",
    message: "Your sugar jar is at 15g. Consider refilling soon.",
    container: "Sugar Jar",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "empty" as const,
    title: "Flour Container Empty",
    message: "Your flour container is completely empty. Time to restock!",
    container: "Flour Container",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "3",
    type: "info" as const,
    title: "New Container Added",
    message: "Coffee Container has been successfully added to your pantry.",
    container: "Coffee Container",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "success" as const,
    title: "WiFi Connected",
    message: "Your Mother device is now connected to WiFi and ready to monitor.",
    container: "System",
    time: "1 day ago",
    read: true,
  },
];

const getNotificationColor = (type: "low" | "empty" | "info" | "success") => {
  switch (type) {
    case "low": return "#FFB344";
    case "empty": return "#E36565";
    case "info": return "#497174";
    case "success": return "#7FC8A9";
  }
};

const getNotificationIcon = (type: "low" | "empty" | "info" | "success") => {
  switch (type) {
    case "low": return "warning";
    case "empty": return "close-circle";
    case "info": return "information-circle";
    case "success": return "checkmark-circle";
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
      <TouchableOpacity
        key={notification.id}
        className={`bg-white/80 rounded-2xl p-4 mb-3 shadow-soft backdrop-blur-sm active:scale-95 transition-all duration-200 ${
          !notification.read ? 'border-l-4' : ''
        }`}
        style={{
          shadowColor: '#497174',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
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
              <Text className="text-base font-semibold text-foreground">
                {notification.title}
              </Text>
              {!notification.read && (
                <View className="w-2 h-2 bg-primary rounded-full" />
              )}
            </View>
            <Text className="text-sm text-muted-foreground mb-2 leading-relaxed">
              {notification.message}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-muted-foreground">
                {notification.container}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {notification.time}
              </Text>
            </View>
          </View>
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
                Notifications
              </Text>
              <Text className="text-base text-muted-foreground">
                Stay updated on your pantry
              </Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-primary rounded-2xl items-center justify-center shadow-soft">
              <Ionicons name="settings" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View className="bg-white/80 rounded-2xl p-1 shadow-soft backdrop-blur-sm">
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setShowRead(true)}
                className={`flex-1 py-2 px-4 rounded-xl ${
                  showRead ? 'bg-primary' : 'bg-transparent'
                }`}
              >
                <Text className={`text-sm font-medium text-center ${
                  showRead ? 'text-white' : 'text-muted-foreground'
                }`}>
                  All ({mockNotifications.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowRead(false)}
                className={`flex-1 py-2 px-4 rounded-xl ${
                  !showRead ? 'bg-primary' : 'bg-transparent'
                }`}
              >
                <Text className={`text-sm font-medium text-center ${
                  !showRead ? 'text-white' : 'text-muted-foreground'
                }`}>
                  Unread ({mockNotifications.filter(n => !n.read).length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications List */}
        <View className="mb-6">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(renderNotification)
          ) : (
            <View className="flex-1 justify-center items-center py-12">
              <View className="w-24 h-24 bg-muted/20 rounded-2xl items-center justify-center mb-6">
                <Ionicons name="notifications-off" size={48} color="#5C5C5C" />
              </View>
              <Text className="text-lg font-semibold text-foreground text-center mb-2">
                No notifications
              </Text>
              <Text className="text-base text-muted-foreground text-center leading-relaxed max-w-sm">
                {showRead 
                  ? "You're all caught up! Check back later for updates."
                  : "No unread notifications at the moment."
                }
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        {filteredNotifications.length > 0 && (
          <View className="mb-8">
            <View className="flex-row space-x-3">
              <TouchableOpacity className="flex-1 bg-white/80 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
                <View className="items-center">
                  <View className="w-12 h-12 bg-primary/20 rounded-xl items-center justify-center mb-3">
                    <Ionicons name="checkmark-done" size={24} color="#497174" />
                  </View>
                  <Text className="text-sm font-semibold text-foreground text-center">
                    Mark All Read
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-1 bg-white/80 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
                <View className="items-center">
                  <View className="w-12 h-12 bg-accent/20 rounded-xl items-center justify-center mb-3">
                    <Ionicons name="trash" size={24} color="#F2B6A0" />
                  </View>
                  <Text className="text-sm font-semibold text-foreground text-center">
                    Clear All
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
} 