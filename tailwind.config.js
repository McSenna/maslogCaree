/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}" 
  ],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
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
    },
  },
  plugins: [],
};