import React, { createContext, useContext } from "react";

const FirebaseContext = createContext({});

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  // Firebase logic will go here
  return <FirebaseContext.Provider value={{}}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => useContext(FirebaseContext); 