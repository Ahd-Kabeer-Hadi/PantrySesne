import { Stack } from "expo-router";
import RootProviders from "../providers/RootProviders";
import "./global.css";

export default function RootLayout() {
  return (
    <RootProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </RootProviders>
  );
}
