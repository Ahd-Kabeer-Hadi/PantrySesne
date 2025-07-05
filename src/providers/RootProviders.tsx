import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { AuthProvider } from "./AuthProvider"; // Uncomment when auth is implemented
// import { BLEProvider } from "./BLEProvider";
import { FirebaseProvider } from "./FirebaseProvider";
import { ThemeProvider } from "../hooks/useThemes";

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    // <AuthProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <FirebaseProvider>
              {children}
          </FirebaseProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    // </AuthProvider>
  );
} 