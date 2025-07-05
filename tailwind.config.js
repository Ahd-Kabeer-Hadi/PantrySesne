/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Main Green
        primary: {
          DEFAULT: "#8fb716",
          light: "#a3c42a",
          dark: "#7a9f0f",
          50: "#f7fdf0",
          100: "#eefad8",
          200: "#ddf4b0",
          300: "#c8ec7f",
          400: "#b0e04a",
          500: "#8fb716",
          600: "#7a9f0f",
          700: "#5f7a0d",
          800: "#4c6110",
          900: "#3f5012",
        },
        
        // Secondary Colors - Light Green
        secondary: {
          DEFAULT: "#e4fa5b",
          light: "#f0ff7a",
          dark: "#d8f04a",
          50: "#fafff0",
          100: "#f7ffd8",
          200: "#e4fa5b",
          300: "#d8f04a",
          400: "#cce03a",
          500: "#b8d13f",
          600: "#9bb02a",
          700: "#7a8c22",
          800: "#5f6e1e",
          900: "#4f5a1d",
        },
        
        // Accent Colors - Gray
        accent: {
          DEFAULT: "#b8b8b8",
          light: "#d0d0d0",
          dark: "#a0a0a0",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d0d0d0",
          400: "#b8b8b8",
          500: "#a0a0a0",
          600: "#8a8a8a",
          700: "#6b6b6b",
          800: "#4a4a4a",
          900: "#2a2a2a",
        },
        
        // Success Colors - Using green
        success: {
          DEFAULT: "#8fb716",
          light: "#a3c42a",
          dark: "#7a9f0f",
          50: "#f7fdf0",
          100: "#eefad8",
          200: "#ddf4b0",
          300: "#c8ec7f",
          400: "#b0e04a",
          500: "#8fb716",
          600: "#7a9f0f",
          700: "#5f7a0d",
          800: "#4c6110",
          900: "#3f5012",
        },
        
        // Warning Colors - Using light green
        warning: {
          DEFAULT: "#e4fa5b",
          light: "#f0ff7a",
          dark: "#d8f04a",
          50: "#fafff0",
          100: "#f7ffd8",
          200: "#e4fa5b",
          300: "#d8f04a",
          400: "#cce03a",
          500: "#b8d13f",
          600: "#9bb02a",
          700: "#7a8c22",
          800: "#5f6e1e",
          900: "#4f5a1d",
        },
        
        // Error Colors - Standard red
        error: {
          DEFAULT: "#dc2626",
          light: "#ef4444",
          dark: "#b91c1c",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        
        // Text Colors
        text: {
          primary: "#0c0b0e",
          secondary: "#4a4a4a",
          tertiary: "#6b7280",
          inverse: "#ffffff",
          disabled: "#b8b8b8",
        },
        
        // Surface Colors
        surface: {
          DEFAULT: "#ffffff",
          elevated: "#fafafa",
          card: "#ffffff",
          overlay: "rgba(12, 11, 14, 0.5)",
        },
        
        // Background Colors
        background: {
          DEFAULT: "#ffffff",
          secondary: "#fafafa",
          tertiary: "#f5f5f5",
        },
        
        // Border Colors
        border: {
          DEFAULT: "#e5e5e5",
          light: "#f0f0f0",
          dark: "#d0d0d0",
        },
        
        // Dark Theme Colors
        dark: {
          // Primary - Lighter green for dark mode
          primary: {
            DEFAULT: "#a3c42a",
            light: "#b8d13f",
            dark: "#8fb716",
          },
          
          // Secondary - Adjusted for dark mode
          secondary: {
            DEFAULT: "#d8f04a",
            light: "#e4fa5b",
            dark: "#cce03a",
          },
          
          // Accent - Lighter gray for dark mode
          accent: {
            DEFAULT: "#d0d0d0",
            light: "#e0e0e0",
            dark: "#b8b8b8",
          },
          
          // Success - Lighter green for dark mode
          success: {
            DEFAULT: "#a3c42a",
            light: "#b8d13f",
            dark: "#8fb716",
          },
          
          // Warning - Adjusted for dark mode
          warning: {
            DEFAULT: "#d8f04a",
            light: "#e4fa5b",
            dark: "#cce03a",
          },
          
          // Error - Lighter red for dark mode
          error: {
            DEFAULT: "#ef4444",
            light: "#f87171",
            dark: "#dc2626",
          },
          
          // Text for dark mode
          text: {
            primary: "#ffffff",
            secondary: "#e0e0e0",
            tertiary: "#b8b8b8",
            inverse: "#0c0b0e",
            disabled: "#6b7280",
          },
          
          // Surface for dark mode
          surface: {
            DEFAULT: "#0c0b0e",
            elevated: "#1a1a1a",
            card: "#0c0b0e",
            overlay: "rgba(255, 255, 255, 0.1)",
          },
          
          // Background for dark mode
          background: {
            DEFAULT: "#0c0b0e",
            secondary: "#1a1a1a",
            tertiary: "#2a2a2a",
          },
          
          // Border for dark mode
          border: {
            DEFAULT: "#2a2a2a",
            light: "#3a3a3a",
            dark: "#1a1a1a",
          },
        },
      },
      
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Custom border radius - Clean and elegant
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      
      // Clean shadows - No neumorphism
      boxShadow: {
        'sm': '0 1px 2px rgba(12, 11, 14, 0.05)',
        'md': '0 4px 6px rgba(12, 11, 14, 0.1)',
        'lg': '0 10px 15px rgba(12, 11, 14, 0.1)',
        'xl': '0 20px 25px rgba(12, 11, 14, 0.15)',
        '2xl': '0 25px 50px rgba(12, 11, 14, 0.25)',
      },
      
      // Clean animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      // Simple keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      // Clean font families
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}