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
      // Mirrors src/theme/palette.ts, the source of truth. Keep the two in sync.
      colors: {
        primary: "#1565D8",
        "primary-soft": "#EEF5FF",
        secondary: "#0F766E",
        accent: "#D97706",

        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",

        surface: "#FFFFFF",
        elevated: "#F8FAFC",
        background: "#F7FAFE",
        border: "#E2E8F0",

        "text-primary": "#0F2557",
        "text-secondary": "#334155",
        "text-tertiary": "#56657A",
        "text-disabled": "#94A3B8",

        // Admin announcements palette. Values live in src/theme/announcementTokens.ts
        // (light and dark) and reach these names through CSS variables set by
        // useAnnouncementThemeVars, so one class works in both themes.
        page: "var(--an-page)",
        canvas: "var(--an-canvas)",
        ink: "var(--an-ink)",
        text2: "var(--an-text2)",
        text3: "var(--an-text3)",
        body: "var(--an-body)",
        placeholder: "var(--an-placeholder)",
        brand: {
          DEFAULT: "var(--an-brand)",
          hover: "var(--an-brand-hover)",
          tint: "var(--an-brand-tint)",
          on: "var(--an-brand-on)",
        },
        avatar: "var(--an-avatar)",
        line: "var(--an-line)",
        divider: "var(--an-divider)",
        field: "var(--an-field)",
        shell: "var(--an-shell)",
        head: "var(--an-head)",
        rowopen: "var(--an-rowopen)",
        neutral: "var(--an-neutral)",
        navhover: "var(--an-navhover)",
        status: {
          active: "var(--an-status-active)",
          draft: "var(--an-status-draft)",
          expired: "var(--an-status-expired)",
        },
        destructive: {
          DEFAULT: "var(--an-destructive)",
          bg: "var(--an-destructive-bg)",
          border: "var(--an-destructive-border)",
        },
        toast: {
          DEFAULT: "var(--an-toast)",
          text: "var(--an-toast-text)",
          action: "var(--an-toast-action)",
          icon: "var(--an-toast-icon)",
        },
        scrim: "var(--an-scrim)",
      },

      fontFamily: {
        ps: ["PublicSans_400Regular"],
        "ps-medium": ["PublicSans_500Medium"],
        "ps-semibold": ["PublicSans_600SemiBold"],
        "ps-bold": ["PublicSans_700Bold"],
      },

      lineHeight: {
        21: "21px",
        23: "23px",
      },

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

        // Exact sizes for the admin announcements screen.
        12: "12px",
        13: "13px",
        14: "14px",
        15: "15px",
        22: "22px",
        24: "24px",
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

        // Admin announcements: controls, count badges, table container.
        control: "6px",
        badge: "4px",
        panel: "8px",
      },

      boxShadow: {
        none: "0 0 0 0 rgba(0, 0, 0, 0)",
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
        sm: "0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        base: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px 0 rgba(15, 23, 42, 0.06)",
        md: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.06)",
        lg: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
        xl: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)",
        "2xl": "0 25px 50px -12px rgba(15, 23, 42, 0.15)",

        elevation1: "0 2px 8px rgba(15, 23, 42, 0.05)",
        elevation2: "0 4px 12px rgba(15, 23, 42, 0.08)",
        elevation3: "0 8px 16px rgba(15, 23, 42, 0.1)",
      },

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
