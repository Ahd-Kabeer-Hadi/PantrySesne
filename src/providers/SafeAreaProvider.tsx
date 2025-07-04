import { SafeAreaProvider as RNProvider } from 'react-native-safe-area-context';

export const SafeAreaProvider = ({ children }: { children: React.ReactNode }) => (
  <RNProvider>
    
    {children}
    </RNProvider>
); 