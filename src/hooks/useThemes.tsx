// src/hooks/useThemes.tsx
// Theme configuration with light theme as default to prevent visibility issues
// System theme override is disabled by default - only applies when user explicitly chooses 'system'
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
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
  // Primary - Main Green
  primary: '#8fb716',
  primaryLight: '#a3c42a',
  primaryDark: '#7a9f0f',
  
  // Secondary - Light Green
  secondary: '#e4fa5b',
  secondaryLight: '#f0ff7a',
  secondaryDark: '#d8f04a',
  
  // Accent - Gray
  accent: '#b8b8b8',
  accentLight: '#d0d0d0',
  accentDark: '#a0a0a0',
  
  // Status - Using green variations
  success: '#8fb716',
  successLight: '#a3c42a',
  successDark: '#7a9f0f',
  warning: '#e4fa5b',
  warningLight: '#f0ff7a',
  warningDark: '#d8f04a',
  error: '#dc2626',
  errorLight: '#ef4444',
  errorDark: '#b91c1c',
  
  // Text
  textPrimary: '#0c0b0e',
  textSecondary: '#4a4a4a',
  textTertiary: '#6b7280',
  textInverse: '#ffffff',
  textDisabled: '#b8b8b8',
  
  // Surface
  surface: '#ffffff',
  surfaceElevated: '#fafafa',
  surfaceCard: '#ffffff',
  surfaceOverlay: 'rgba(12, 11, 14, 0.5)',
  
  // Background
  background: '#ffffff',
  backgroundSecondary: '#fafafa',
  backgroundTertiary: '#f5f5f5',
  
  // Border
  border: '#e5e5e5',
  borderLight: '#f0f0f0',
  borderDark: '#d0d0d0',
};

export const darkTheme: ThemeColors = {
  // Primary - Main Green (slightly lighter for dark mode)
  primary: '#a3c42a',
  primaryLight: '#b8d13f',
  primaryDark: '#8fb716',
  
  // Secondary - Light Green (adjusted for dark mode)
  secondary: '#d8f04a',
  secondaryLight: '#e4fa5b',
  secondaryDark: '#cce03a',
  
  // Accent - Gray (lighter for dark mode)
  accent: '#d0d0d0',
  accentLight: '#e0e0e0',
  accentDark: '#b8b8b8',
  
  // Status - Using green variations
  success: '#a3c42a',
  successLight: '#b8d13f',
  successDark: '#8fb716',
  warning: '#d8f04a',
  warningLight: '#e4fa5b',
  warningDark: '#cce03a',
  error: '#ef4444',
  errorLight: '#f87171',
  errorDark: '#dc2626',
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textTertiary: '#b8b8b8',
  textInverse: '#0c0b0e',
  textDisabled: '#6b7280',
  
  // Surface
  surface: '#0c0b0e',
  surfaceElevated: '#1a1a1a',
  surfaceCard: '#0c0b0e',
  surfaceOverlay: 'rgba(255, 255, 255, 0.1)',
  
  // Background
  background: '#0c0b0e',
  backgroundSecondary: '#1a1a1a',
  backgroundTertiary: '#2a2a2a',
  
  // Border
  border: '#2a2a2a',
  borderLight: '#3a3a3a',
  borderDark: '#1a1a1a',
};

interface ThemeStore {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  updateTheme: (systemColorScheme: ColorSchemeName | null) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themeMode: 'light',
      isDark: false,
      colors: lightTheme,
      
      setThemeMode: (mode: ThemeMode) => {
        set({ themeMode: mode });
        // Update theme immediately after setting mode
        // Note: We can't call useColorScheme here as it's not a hook context
        // This will be handled in the useTheme hook
      },
      
      updateTheme: (systemColorScheme: ColorSchemeName | null) => {
        const { themeMode } = get();
        let isDark = false;
        
        // Only use system theme if explicitly set to 'system' and systemColorScheme is provided
        // Otherwise, use the user's chosen theme
        if (themeMode === 'system' && systemColorScheme !== null) {
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
  
  // Update theme when system color scheme changes, but only if user has chosen 'system'
  useEffect(() => {
    // Only update based on system theme if user explicitly chose 'system' mode
    if (themeMode === 'system') {
    updateTheme(systemColorScheme);
    } else {
      // For light/dark modes, ignore system theme changes
      updateTheme(null);
    }
  }, [systemColorScheme, themeMode, updateTheme]);
  
  return {
    themeMode,
    isDark,
    colors,
    setThemeMode,
    systemColorScheme,
  };
};

// Theme context for React components
interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  systemColorScheme: ColorSchemeName;
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

// Common theme-based class names for NativeWind
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
    background: 'dark:bg-background',
    surface: 'dark:bg-surface',
    card: 'dark:bg-surface-card',
    text: {
      primary: 'dark:text-text-primary',
      secondary: 'dark:text-text-secondary',
      tertiary: 'dark:text-text-tertiary',
    },
    border: 'dark:border-border',
  },
};

export const getThemeClasses = (isDark: boolean) => {
  return isDark ? themeClasses.dark : themeClasses.light;
};