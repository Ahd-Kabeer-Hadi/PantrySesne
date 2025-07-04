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
        // Primary Colors
        primary: {
          DEFAULT: "#497174",
          light: "#5aa3ad",
          dark: "#3d5d60",
          50: "#f0f9fa",
          100: "#d9f2f4",
          200: "#b8e6ea",
          300: "#8dd5dc",
          400: "#5aa3ad",
          500: "#497174",
          600: "#3d5d60",
          700: "#354d50",
          800: "#2f4143",
          900: "#2a393a",
        },
        
        // Secondary Colors
        secondary: {
          DEFAULT: "#d6e4e5",
          light: "#e6f1f2",
          dark: "#b8d1d3",
          50: "#f8fbfb",
          100: "#e6f1f2",
          200: "#d6e4e5",
          300: "#b8d1d3",
          400: "#9abec1",
          500: "#7ca6aa",
          600: "#628b8f",
          700: "#4f7075",
          800: "#3f5a5d",
          900: "#344a4c",
        },
        
        // Accent Colors
        accent: {
          DEFAULT: "#f2b6a0",
          light: "#f7c8b8",
          dark: "#ec9a7a",
          50: "#fef7f4",
          100: "#fdede6",
          200: "#f7c8b8",
          300: "#f2b6a0",
          400: "#ec9a7a",
          500: "#e67e54",
          600: "#d6623a",
          700: "#b34d2a",
          800: "#8f3e25",
          900: "#743323",
        },
        
        // Success Colors
        success: {
          DEFAULT: "#7fc8a9",
          light: "#a3e2c7",
          dark: "#5db08c",
          50: "#f0fdf6",
          100: "#dcfce8",
          200: "#a3e2c7",
          300: "#7fc8a9",
          400: "#5db08c",
          500: "#3d9970",
          600: "#2d7a5a",
          700: "#245f47",
          800: "#1e4d3a",
          900: "#1a3f30",
        },
        
        // Warning Colors
        warning: {
          DEFAULT: "#ffb344",
          light: "#ffdd85",
          dark: "#ff9a1a",
          50: "#fffbeb",
          100: "#fff3c4",
          200: "#ffdd85",
          300: "#ffb344",
          400: "#ff9a1a",
          500: "#f57c00",
          600: "#e65100",
          700: "#bf360c",
          800: "#8d2f0a",
          900: "#5d1f07",
        },
        
        // Error Colors
        error: {
          DEFAULT: "#e36565",
          light: "#fca5a5",
          dark: "#dc2626",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fca5a5",
          300: "#e36565",
          400: "#dc2626",
          500: "#b91c1c",
          600: "#991b1b",
          700: "#7f1d1d",
          800: "#651f1f",
          900: "#4c1f1f",
        },
        
        // Text Colors
        text: {
          primary: "#1b1b1b",
          secondary: "#5c5c5c",
          tertiary: "#718096",
          inverse: "#ffffff",
          disabled: "#a0a0a0",
        },
        
        // Surface Colors
        surface: {
          DEFAULT: "#ffffff",
          elevated: "#ffffff",
          card: "#ffffff",
          overlay: "rgba(0, 0, 0, 0.5)",
        },
        
        // Background Colors
        background: {
          DEFAULT: "#f9fafb",
          secondary: "#f7fafc",
          tertiary: "#edf2f7",
        },
        
        // Border Colors
        border: {
          DEFAULT: "#e2e8f0",
          light: "#f1f5f9",
          dark: "#cbd5e0",
        },
        
        // Dark Theme Colors
        dark: {
          // Primary remains the same but lighter for dark mode
          primary: {
            DEFAULT: "#8abfc5",
            light: "#a8d1d6",
            dark: "#6ca8ae",
          },
          
          // Accent for dark mode
          accent: {
            DEFAULT: "#f4c7b5",
            light: "#f7d4c7",
            dark: "#f0b5a0",
          },
          
          // Success for dark mode
          success: {
            DEFAULT: "#96e4c2",
            light: "#b0ecd0",
            dark: "#7dd9b4",
          },
          
          // Warning for dark mode
          warning: {
            DEFAULT: "#ffc37b",
            light: "#ffd299",
            dark: "#ffb85c",
          },
          
          // Error for dark mode
          error: {
            DEFAULT: "#f27d7d",
            light: "#f59999",
            dark: "#ef6161",
          },
          
          // Text for dark mode
          text: {
            primary: "#f1f1f1",
            secondary: "#b0b0b0",
            tertiary: "#8a8a8a",
            inverse: "#121212",
            disabled: "#666666",
          },
          
          // Surface for dark mode
          surface: {
            DEFAULT: "#1e1e1e",
            elevated: "#2a2a2a",
            card: "#1e1e1e",
            overlay: "rgba(255, 255, 255, 0.1)",
          },
          
          // Background for dark mode
          background: {
            DEFAULT: "#121212",
            secondary: "#1a1a1a",
            tertiary: "#242424",
          },
          
          // Border for dark mode
          border: {
            DEFAULT: "#2a2a2a",
            light: "#333333",
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
      
      // Custom border radius
      borderRadius: {
        'soft': '8px',
        'medium': '16px',
        'large': '24px',
        'extra': '32px',
      },
      
      // Custom shadows
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'neumorphic': '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neumorphic-dark': '8px 8px 16px rgba(0, 0, 0, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.05)',
        'glow-primary': '0 0 20px rgba(73, 113, 116, 0.3)',
        'glow-accent': '0 0 20px rgba(242, 182, 160, 0.3)',
        'glow-success': '0 0 20px rgba(127, 200, 169, 0.3)',
        'glow-warning': '0 0 20px rgba(255, 179, 68, 0.3)',
        'glow-error': '0 0 20px rgba(227, 101, 101, 0.3)',
      },
      
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-from-top': 'slideInFromTop 0.3s ease-out',
        'slide-in-from-bottom': 'slideInFromBottom 0.3s ease-out',
        'slide-in-from-left': 'slideInFromLeft 0.3s ease-out',
        'slide-in-from-right': 'slideInFromRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'breathing': 'breathing 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
      },
      
      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        breathing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      
      // Custom font families
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'manrope': ['Manrope', 'system-ui', 'sans-serif'],
      },
      
      // Custom backdrop blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for glass effect
    function({ addUtilities }) {
      addUtilities({
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      })
    },
  ],
}