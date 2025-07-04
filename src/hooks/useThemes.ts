// src/hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

// MMKV storage for theme persistence
const storage = new MMKV({
  id: 'theme-storage',
});

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    storage.set(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Primary
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Accent
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // Status
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  textDisabled: string;
  
  // Surface
  surface: string;
  surfaceElevated: string;
  surfaceCard: string;
  surfaceOverlay: string;
  
  // Background
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Border
  border: string;
  borderLight: string;
  borderDark: string;
}

export const lightTheme: ThemeColors = {
  // Primary
  primary: '#497174',
  primaryLight: '#5aa3ad',
  primaryDark: '#3d5d60',
  
  // Secondary
  secondary: '#d6e4e5',
  secondaryLight: '#e6f1f2',
  secondaryDark: '#b8d1d3',
  
  // Accent
  accent: '#f2b6a0',
  accentLight: '#f7c8b8',
  accentDark: '#ec9a7a',
  
  // Status
  success: '#7fc8a9',
  successLight: '#a3e2c7',
  successDark: '#5db08c',
  warning: '#ffb344',
  warningLight: '#ffdd85',
  warningDark: '#ff9a1a',
  error: '#e36565',
  errorLight: '#fca5a5',
  errorDark: '#dc2626',
  
  // Text
  textPrimary: '#1b1b1b',
  textSecondary: '#5c5c5c',
  textTertiary: '#718096',
  textInverse: '#ffffff',
  textDisabled: '#a0a0a0',
  
  // Surface
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  surfaceCard: '#ffffff',
  surfaceOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Background
  background: '#f9fafb',
  backgroundSecondary: '#f7fafc',
  backgroundTertiary: '#edf2f7',
  
  // Border
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e0',
};

export const darkTheme: ThemeColors = {
  // Primary (adjusted for dark mode)
  primary: '#8abfc5',
  primaryLight: '#a8d1d6',
  primaryDark: '#6ca8ae',
  
  // Secondary
  secondary: '#2d3748',
  secondaryLight: '#4a5568',
  secondaryDark: '#1a202c',
  
  // Accent
  accent: '#f4c7b5',
  accentLight: '#f7d4c7',
  accentDark: '#f0b5a0',
  
  // Status
  success: '#96e4c2',
  successLight: '#b0ecd0',
  successDark: '#7dd9b4',
  warning: '#ffc37b',
  warningLight: '#ffd299',
  warningDark: '#ffb85c',
  error: '#f27d7d',
  errorLight: '#f59999',
  errorDark: '#ef6161',
  
  // Text
  textPrimary: '#f1f1f1',
  textSecondary: '#b0b0b0',
  textTertiary: '#8a8a8a',
  textInverse: '#121212',
  textDisabled: '#666666',
  
  // Surface
  surface: '#1e1e1e',
  surfaceElevated: '#2a2a2a',
  surfaceCard: '#1e1e1e',
  surfaceOverlay: 'rgba(255, 255, 255, 0.1)',
  
  // Background
  background: '#121212',
  backgroundSecondary: '#1a1a1a',
  backgroundTertiary: '#242424',
  
  // Border
  border: '#2a2a2a',
  borderLight: '#333333',
  borderDark: '#1a1a1a',
};

interface ThemeStore {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  updateTheme: (systemColorScheme: 'light' | 'dark' | null) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      isDark: false,
      colors: lightTheme,
      
      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
        // Update theme immediately after setting mode
        const systemColorScheme = useColorScheme();
        get().updateTheme(systemColorScheme);
      },
      
      updateTheme: (systemColorScheme: 'light' | 'dark' | null) => {
        const { themeMode } = get();
        let isDark = false;
        
        if (themeMode === 'system') {
          isDark = systemColorScheme === 'dark';
        } else {
          isDark = themeMode === 'dark';
        }
        
        set({
          isDark,
          colors: isDark ? darkTheme : lightTheme,
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ themeMode: state.themeMode }),
    }
  )
);

// Custom hook for using theme
export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const {
    themeMode,
    isDark,
    colors,
    setThemeMode,
    updateTheme,
  } = useThemeStore();
  
  // Update theme when system color scheme changes
  React.useEffect(() => {
    updateTheme(systemColorScheme);
  }, [systemColorScheme, updateTheme]);
  
  return {
    themeMode,
    isDark,
    colors,
    setThemeMode,
    systemColorScheme,
  };
};

// Theme context for React components
import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  systemColorScheme: 'light' | 'dark' | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// Utility functions for theme-based styling
export const getThemeColor = (colorKey: keyof ThemeColors, isDark: boolean) => {
  const colors = isDark ? darkTheme : lightTheme;
  return colors[colorKey];
};

export const createThemedStyle = (
  lightStyles: any,
  darkStyles: any,
  isDark: boolean
) => {
  return isDark ? { ...lightStyles, ...darkStyles } : lightStyles;
};

// Common theme-based class names
export const themeClasses = {
  light: {
    background: 'bg-background',
    surface: 'bg-surface',
    card: 'bg-surface-card',
    text: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      tertiary: 'text-text-tertiary',
    },
    border: 'border-border',
  },
  dark: {
    background: 'bg-dark-background-DEFAULT',
    surface: 'bg-dark-surface-DEFAULT',
    card: 'bg-dark-surface-card',
    text: {
      primary: 'text-dark-text-primary',
      secondary: 'text-dark-text-secondary',
      tertiary: 'text-dark-text-tertiary',
    },
    border: 'border-dark-border-DEFAULT',
  },
};

export const getThemeClasses = (isDark: boolean) => {
  return isDark ? themeClasses.dark : themeClasses.light;
};