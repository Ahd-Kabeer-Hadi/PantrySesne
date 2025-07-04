import React, { createContext, useContext } from "react";

const BLEContext = createContext({});

export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
  // BLE logic will go here
  return <BLEContext.Provider value={{}}>{children}</BLEContext.Provider>;
};

export const useBLE = () => useContext(BLEContext); 