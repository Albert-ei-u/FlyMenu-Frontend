import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0D0D0D",
          900: "#111111",
          850: "#131313",
          800: "#1A1A1A",
          700: "#262626",
          500: "#666666",
        },
        fly: {
          orange: "#F97316",
          peach: "#FFB690",
          rose: "#E0C0B1",
          fog: "#E5E2E1",
        },
      },
      fontFamily: {
        display: ["Satoshi", "Manrope", "Aptos", "sans-serif"],
        body: ["Manrope", "Aptos", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 70px rgba(249, 115, 22, 0.24)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-6px) rotate(2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 12px rgba(249, 115, 22, 0.2))" },
          "50%": { filter: "drop-shadow(0 0 28px rgba(249, 115, 22, 0.45))" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "page-enter": {
          "0%": { opacity: "0", transform: "translateY(12px)", filter: "blur(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "border-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "orbit-slow": {
          "0%": { transform: "rotate(0deg) translateX(8px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(8px) rotate(-360deg)" },
        },
        "hero-glow": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.65", transform: "scale(1.06)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.65s ease-out both",
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.55s ease-out both",
        float: "float 4.5s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.8s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "ken-burns": "ken-burns 18s ease-out forwards",
        "page-enter": "page-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-up": "slide-up 0.7s ease-out both",
        "border-glow": "border-glow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        marquee: "marquee 28s linear infinite",
        "orbit-slow": "orbit-slow 14s linear infinite",
        "hero-glow": "hero-glow 5s ease-in-out infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
