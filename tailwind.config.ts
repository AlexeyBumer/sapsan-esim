import type { Config } from "tailwindcss";

/**
 * Sapsan eSIM — Design Tokens
 * Авиационная премиальная палитра: глубокий teal + тёплый персиковый акцент.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Фон
        abyss: "#021111",
        deep: "#062222",
        // Поверхности
        surface: "#0d2f2f",
        "surface-2": "#103838",
        "surface-3": "#1f4d4d",
        // Акцент
        peach: "#ffdead",
        // Текст
        ink: "#ffffff",
        mist: "#d7e0e0",
      },
      fontFamily: {
        display: ["var(--font-prociono)", "Prociono", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "hero": ["clamp(2.75rem, 8vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "section": ["clamp(2rem, 5vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(255,222,173,0.12), transparent 60%)",
        "peach-grad": "linear-gradient(135deg, #ffdead 0%, #ffcf8f 100%)",
        "surface-grad": "linear-gradient(145deg, rgba(16,56,56,0.6) 0%, rgba(6,34,34,0.4) 100%)",
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(255,222,173,0.45)",
        "glow-sm": "0 0 30px -8px rgba(255,222,173,0.35)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "pulse-ring": "pulse-ring 2.5s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
