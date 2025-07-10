import * as React from "react";
import InitialLayout from "../components/InitialLayout";
import RootProviders from "../providers/RootProviders";
import "./global.css";
import { Buffer } from "buffer";
global.Buffer = Buffer;

export default function RootLayout() {
  return (
    <RootProviders>
      <InitialLayout />
    </RootProviders>
  );
}
