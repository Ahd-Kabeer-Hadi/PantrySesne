import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { ThemedText, ThemedButton } from "../../components/ThemedComponents";
import { Ionicons } from "@expo/vector-icons";

const ConnectionLoadingScreen = ({ onCancel }: { onCancel: () => void }) => {
  const [dots, setDots] = useState("");
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Move interpolation to useMemo to prevent calculation during render
  const spin = React.useMemo(() => {
    return rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  }, [rotateAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    rotateAnimation.start();

    return () => {
      clearInterval(interval);
      rotateAnimation.stop();
    };
  }, [rotateAnim]);

  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="items-center mb-8">
        <View className="w-24 h-24 bg-[#8fb716] rounded-full justify-center items-center relative">
          <Animated.View
            style={{
              transform: [{ rotate: spin }],
            }}
            className="absolute w-20 h-20 border-2 border-white border-t-transparent rounded-full"
          />
          
          <Ionicons name="wifi" size={24} color="#ffffff" />
        </View>
      </View>

      <View className="items-center mb-8">
        <ThemedText size="xl" weight="bold" className="text-center mb-2">
          Connecting to Hub{dots}
        </ThemedText>
        
        <ThemedText variant="secondary" className="text-center max-w-sm">
          Establishing secure connection with your PantrySense Hub device
        </ThemedText>
      </View>

      <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 w-full max-w-sm">
        <View className="flex-row items-center">
          <Ionicons name="information-circle" size={16} color="#3b82f6" />
          <ThemedText size="sm" weight="semibold" className="text-blue-800 ml-2">
            Connection Status
          </ThemedText>
        </View>
        <ThemedText size="sm" variant="secondary" className="text-blue-700 mt-1">
          This usually takes 10-15 seconds
        </ThemedText>
      </View>

      <View className="flex-row space-x-1 mb-8">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </View>

      <ThemedButton
        variant="secondary"
        size="lg"
        onPress={onCancel}
        className="w-full max-w-xs"
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="close" size={18} color="#0c0b0e" />
          <ThemedText size="base" weight="semibold" className="ml-2">
            Cancel Connection
          </ThemedText>
        </View>
      </ThemedButton>
    </View>
  );
};

const ConnectionErrorScreen = ({ 
  onRetry, 
  onBackToDevices 
}: { 
  onRetry: () => void; 
  onBackToDevices: () => void;
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shakeAnimation = Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 5,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -5,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 5,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]);

    shakeAnimation.start();
  }, []);

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Animated.View
        style={{
          transform: [{ translateX: shakeAnim }],
        }}
        className="mb-6"
      >
        <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center">
          <Ionicons name="alert-circle-outline" size={32} color="#dc2626" />
        </View>
      </Animated.View>

      <View className="items-center mb-8">
        <ThemedText size="xl" weight="bold" className="text-center mb-2">
          Connection Failed
        </ThemedText>
        
        <ThemedText variant="secondary" className="text-center mb-8 max-w-sm">
          Unable to connect to your PantrySense Hub. The device may be busy or out of range.
        </ThemedText>

        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 w-full max-w-sm">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={16} color="#3b82f6" />
            <ThemedText size="sm" weight="semibold" className="text-blue-800 ml-2">
              Troubleshooting Tips
            </ThemedText>
          </View>
          <View>
            {[
              "Check if the Hub's LED is blinking",
              "Ensure you're within 10 feet of the device",
              "Try restarting the Hub and scan again",
            ].map((tip, index) => (
              <View key={index} className="flex-row items-start mb-2 last:mb-0">
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#8fb716"
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <ThemedText size="sm" variant="secondary" className="flex-1 leading-5">
                  {tip}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="w-full max-w-sm space-y-3">
        <ThemedButton
          variant="primary"
          size="lg"
          onPress={onRetry}
          className="w-full"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="refresh" size={18} color="#ffffff" />
            <ThemedText size="base" weight="semibold" className="text-white ml-2">
              Try Again
            </ThemedText>
          </View>
        </ThemedButton>
        
        <ThemedButton
          variant="secondary"
          size="lg"
          onPress={onBackToDevices}
          className="w-full"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="arrow-back" size={18} color="#0c0b0e" />
            <ThemedText size="base" weight="semibold" className="ml-2">
              Back to Discovery
            </ThemedText>
          </View>
        </ThemedButton>
      </View>

      <ThemedText size="sm" variant="tertiary" className="text-center mt-4">
        You can also try selecting a different device from the list
      </ThemedText>
    </View>
  );
};

export { ConnectionLoadingScreen, ConnectionErrorScreen };