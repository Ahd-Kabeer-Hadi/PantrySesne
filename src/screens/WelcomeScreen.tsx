import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedContainer, ThemedCard, ThemedText, ThemedButton } from "../components/ThemedComponents";

const { width, height } = Dimensions.get("window");

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <SafeAreaView className="flex-1">
      <ThemedContainer className="flex-1">
        {/* Main Content Container */}
        <View className="flex-1 px-6">
          {/* Top Section - Logo & Brand */}
          <View className="flex-1 justify-center items-center pt-8">
            {/* Logo Container */}
            <View className="items-center mb-8">
              {/* Icon Container with proper contrast */}
              <View className="w-24 h-24 bg-primary rounded-2xl mb-6 items-center justify-center">
                <Ionicons name="leaf" size={40} color="#FFFFFF" />
              </View>
              
              {/* Brand Name */}
              <ThemedText size="3xl" weight="bold" className="text-center mb-3">
                PantrySense
              </ThemedText>
              
              {/* Tagline */}
              <ThemedText size="lg" variant="secondary" className="text-center max-w-xs">
                Your smart kitchen companion
              </ThemedText>
            </View>

            {/* Feature Highlights */}
            <View className="w-full max-w-sm space-y-4 mb-8">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-success rounded-full items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
                <ThemedText variant="secondary" className="flex-1">
                  Smart inventory tracking
                </ThemedText>
              </View>
              
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-success rounded-full items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
                <ThemedText variant="secondary" className="flex-1">
                  Real-time notifications
                </ThemedText>
              </View>
              
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-success rounded-full items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>
                <ThemedText variant="secondary" className="flex-1">
                  Easy setup in minutes
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Bottom Section - CTA */}
          <View className="pb-8 space-y-4">
            {/* Primary CTA Button */}
            <ThemedButton
              variant="primary"
              size="lg"
              onPress={onNext}
              className=""
            >
              <View className="flex-row items-center justify-center">
                <ThemedText size="lg" weight="semibold" variant="inverse" className="mr-2">
                  Get Started
                </ThemedText>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            </ThemedButton>
            
            {/* Setup Time Indicator */}
            <View className="flex-row items-center justify-center mt-2">
              <Ionicons name="time-outline" size={16} color="#6b7280" className="mr-2" />
              <ThemedText size="sm" variant="tertiary">
                Setup takes less than 2 minutes
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedContainer>
    </SafeAreaView>
  );
} 