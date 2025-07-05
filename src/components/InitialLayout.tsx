import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useCallback, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
// import { useAuth } from "../providers/AuthProvider"; // Uncomment when auth is implemented
import { useBLEStore } from "../stores/bleStore";

// TEMPORARY: Onboarding logic commented out for testing dashboard and other screens
// TODO: Uncomment onboarding logic when ready to test full flow

// Prevent splash from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function InitialLayout() {
  // const { user, loading } = useAuth(); // Uncomment when auth is implemented
  const segments = useSegments();
  const router = useRouter();
  const { isOnboarded } = useBLEStore();
  const [appIsReady, setAppIsReady] = useState(false);

  // const loading = false; // Uncomment when auth is implemented

  useEffect(() => {
    // Simulate async setup (fonts, state, etc)
    async function prepare() {
      // ...any async logic here
      setAppIsReady(true);
    }
    prepare();
  }, []);

  useEffect(() => {
    if (!appIsReady) return;
    // if (loading) return; // Uncomment when auth is implemented

    // --- Future: Auth logic ---
    // const isInAuthScreen = segments[0] === "(auth)";
    // if (!user && !isInAuthScreen) {
    //   router.replace("/(auth)/signin");
    //   return;
    // }
    // if (user && isInAuthScreen) {
    //   router.replace("/(onboarding)");
    //   return;
    // }

    // --- Onboarding logic ---
    const isInOnboarding = segments[0] === "(onboarding)";
    const isInTabs = segments[0] === "(tabs)";
    
    if (!isOnboarded && !isInOnboarding) {
      router.replace("/(onboarding)");
      return;
    }
    if (isOnboarded && isInOnboarding) {
      router.replace("/(tabs)");
      return;
    }
    // --- End onboarding logic ---
  }, [segments, /* loading, user, */ isOnboarded, appIsReady, router]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Keep splash visible
  }

  // if (loading) return null; // Uncomment when auth is implemented

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)" />
      </Stack>
    </View>
  );
} 