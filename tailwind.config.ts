import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#A264D8",
          dark: "#0A0118",
          surface: "#150929",
          border: "#241239",
          muted: "#9B8AB4",
          light: "#F4EEFB",
          accent: "#B987E6",
        },
        score: {
          detractor: "#7A1F0E",
          passive: "#A88416",
          promoter: "#2F6B3A",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "tight-display": "-0.02em",
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
