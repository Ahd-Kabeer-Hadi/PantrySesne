import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { ThemedText } from "../ThemedComponents";
import React from;

const ScanningView = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6">
        <Ionicons name="search" size={32} color="#8fb716" />
      </View>
      
      <ThemedText size="xl" weight="bold" className="text-center mb-2">
        Discovering Devices
      </ThemedText>
      <ThemedText variant="secondary" className="text-center mb-8 max-w-sm">
        Scanning for your PantrySense Hub nearby...
      </ThemedText>
      
      <View className="flex-row space-x-1 mb-4">
        {[0, 1, 2].map((i) => (
          <View 
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </View>
      
      <ThemedText size="sm" variant="tertiary" className="text-center">
        This usually takes a few seconds
      </ThemedText>
    </View>
  );

  export default ScanningView