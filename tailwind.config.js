/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // MASLOG CARE modern healthcare palette (updated)
        mc: {
          primary: "#2A7DE1", // Primary Blue
          secondary: "#2ECC71", // Secondary Green
          accent: "#17A2B8", // Accent Teal
          background: "#F5F7FA",
          card: "#FFFFFF",
          text: "#1F2933",
          textSecondary: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};