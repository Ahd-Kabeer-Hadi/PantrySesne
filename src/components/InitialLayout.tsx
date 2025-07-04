import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
// import { useAuth } from "../providers/AuthProvider"; // Uncomment when auth is implemented
import { useBLEStore } from "../stores/bleStore";

export default function InitialLayout() {
  // const { user, loading } = useAuth(); // Uncomment when auth is implemented
  const segments = useSegments();
  const router = useRouter();
  const { getPersistedDevices } = useBLEStore();

  // Simulate onboarding state (replace with real onboarding state logic)
  const isOnboarded = getPersistedDevices().length > 0;
  // const loading = false; // Uncomment when auth is implemented

  useEffect(() => {
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
    if (!isOnboarded && !isInOnboarding) {
      router.replace("/(onboarding)");
      return;
    }
    if (isOnboarded && isInOnboarding) {
      router.replace("/(tabs)");
      return;
    }
    // --- End onboarding logic ---
  }, [segments, /* loading, user, */ isOnboarded, router]);

  // if (loading) return null; // Uncomment when auth is implemented

  return <Stack screenOptions={{ headerShown: false }} />;
} 