import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fundos quase pretos com leve tom quente/avermelhado
        ink: {
          DEFAULT: "#0a0607",
          900: "#0a0607",
          800: "#120608",
          700: "#180a0d",
          600: "#211013",
        },
        // Vermelhos profundos de dark romance
        blood: {
          900: "#5c0a14",
          800: "#7a0f1c",
          700: "#a11d2e",
          600: "#c0303f",
          500: "#d94452",
        },
        // Dourado champanhe (acento)
        champagne: {
          DEFAULT: "#d9b26a",
          light: "#e7cd94",
          dark: "#b8914c",
        },
        // Rosa esfumaçado (acento secundário)
        smoke: {
          DEFAULT: "#c98a8f",
          light: "#e2b7ba",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(193, 48, 63, 0.45)",
        "glow-gold": "0 0 42px -10px rgba(217, 178, 106, 0.5)",
        card: "0 18px 50px -18px rgba(0, 0, 0, 0.8)",
        "card-hover":
          "0 28px 70px -20px rgba(122, 15, 28, 0.7), 0 0 0 1px rgba(217,178,106,0.15)",
      },
      backgroundImage: {
        "radial-blood":
          "radial-gradient(60% 60% at 50% 0%, rgba(161,29,46,0.35) 0%, rgba(10,6,7,0) 70%)",
        "vignette":
          "radial-gradient(120% 100% at 50% 0%, rgba(10,6,7,0) 40%, rgba(10,6,7,0.85) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
