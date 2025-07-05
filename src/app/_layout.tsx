import InitialLayout from "../components/InitialLayout";
import RootProviders from "../providers/RootProviders";
import "./global.css";

export default function RootLayout() {
  return (
    <RootProviders>
      <InitialLayout />
    </RootProviders>
  );
}
