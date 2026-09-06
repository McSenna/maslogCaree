/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}" 
  ],

  presets: [require("nativewind/preset")],
  theme: {
    screens: {
      xs: "320px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      // ========== COLOR PALETTE ==========
      colors: {
        // Brand colors
        primary: "#3757FF",
        "primary-soft": "#E7EFFF",
        secondary: "#1C9A7F",
        accent: "#F59E0B",
        
        // Status colors
        success: "#27AE60",
        warning: "#F2994A",
        danger: "#EB5757",
        
        // Neutral palette
        surface: "#FFFFFF",
        elevated: "#F8FAFC",
        background: "#F0F4F8",
        border: "#E2E8F0",
        
        // Text colors
        "text-primary": "#121B3B",
        "text-secondary": "#334155",
        "text-tertiary": "#64748B",
        "text-disabled": "#94A3B8",
        
        // Legacy brand
        mc: {
          primary: "#2A7DE1", 
          secondary: "#2ECC71", 
          accent: "#17A2B8", 
          background: "#F5F7FA",
          card: "#FFFFFF",
          text: "#1F2933",
          textSecondary: "#6B7280",
        },
      },

      // ========== TYPOGRAPHY ==========
      fontSize: {
        xs: ["11px", { lineHeight: "1.4" }],
        sm: ["12px", { lineHeight: "1.5" }],
        base: ["14px", { lineHeight: "1.5" }],
        lg: ["16px", { lineHeight: "1.6" }],
        xl: ["18px", { lineHeight: "1.6" }],
        "2xl": ["20px", { lineHeight: "1.6" }],
        "3xl": ["24px", { lineHeight: "1.5" }],
        "4xl": ["28px", { lineHeight: "1.4" }],
        "5xl": ["32px", { lineHeight: "1.4" }],
        "6xl": ["36px", { lineHeight: "1.4" }],
      },

      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },

      // ========== SPACING ==========
      spacing: {
        0: "0px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        7: "28px",
        8: "32px",
        9: "36px",
        10: "40px",
        11: "44px",
        12: "48px",
        16: "64px",
        20: "80px",
      },

      // ========== BORDER RADIUS ==========
      borderRadius: {
        none: "0px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
      },

      // ========== SHADOWS (ELEVATION) ==========
      boxShadow: {
        none: "0 0 0 0 rgba(0, 0, 0, 0)",
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
        sm: "0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        base: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px 0 rgba(15, 23, 42, 0.06)",
        md: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.06)",
        lg: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
        xl: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)",
        "2xl": "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
        
        // Elevation shadows for cards
        elevation1: "0 2px 8px rgba(15, 23, 42, 0.05)",
        elevation2: "0 4px 12px rgba(15, 23, 42, 0.08)",
        elevation3: "0 8px 16px rgba(15, 23, 42, 0.1)",
      },

      // ========== ANIMATION ==========
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "bounce-soft": "bounceSoft 0.6s ease-in-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};