import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
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
        <View className="absolute top-1/2 left-1/4 w-16 h-16 bg-success/8 rounded-full blur-md" />
      </View>

      <View className="flex-1 px-6 pt-8 pb-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary rounded-2xl shadow-soft mb-4 items-center justify-center">
            <Ionicons name="leaf" size={32} color="#FFFFFF" />
          </View>
          <Text className="text-2xl font-bold text-primary text-center mb-2">
            PantrySense
          </Text>
          <Text className="text-base text-muted-foreground text-center">
            Your smart kitchen companion
          </Text>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center">
          {/* Hero Section */}
          <View className="items-center mb-12">
            <View className="w-64 h-64 bg-white/80 rounded-3xl shadow-soft mb-6 items-center justify-center backdrop-blur-md">
              <View className="w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl items-center justify-center mb-4">
                <Ionicons name="restaurant" size={64} color="#497174" />
              </View>
              <Text className="text-lg font-semibold text-primary text-center">
                Smart Containers
              </Text>
            </View>
            
            <Text className="text-3xl font-bold text-foreground text-center mb-4 leading-tight">
              Never worry about{"\n"}
              <Text className="text-primary">running out again</Text>
            </Text>
            
            <Text className="text-base text-muted-foreground text-center leading-relaxed max-w-sm">
              Your pantry watches itself. Get smart alerts when supplies are low, 
              track expiration dates, and maintain perfect inventory levels.
            </Text>
          </View>

          {/* Feature Cards */}
          <View className="space-y-4 mb-8">
            <View className="flex-row items-center bg-white/60 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
              <View className="w-12 h-12 bg-success/20 rounded-xl items-center justify-center mr-4">
                <Ionicons name="notifications" size={24} color="#7FC8A9" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-1">
                  Smart Alerts
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Get notified before you run out
                </Text>
              </View>
            </View>

            <View className="flex-row items-center bg-white/60 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
              <View className="w-12 h-12 bg-warning/20 rounded-xl items-center justify-center mr-4">
                <Ionicons name="calendar" size={24} color="#FFB344" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-1">
                  Expiration Tracking
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Never waste food again
                </Text>
              </View>
            </View>

            <View className="flex-row items-center bg-white/60 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
              <View className="w-12 h-12 bg-accent/20 rounded-xl items-center justify-center mr-4">
                <Ionicons name="analytics" size={24} color="#F2B6A0" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-1">
                  Usage Analytics
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Understand your consumption patterns
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={onNext}
            className="bg-primary rounded-2xl py-4 px-6 shadow-soft active:scale-95 transition-all duration-200"
            style={{
              shadowColor: '#497174',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white text-lg font-semibold mr-2">
                Get Started
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <Text className="text-xs text-muted-foreground text-center">
            Setup takes less than 2 minutes
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
} 