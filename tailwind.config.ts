import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  // ...
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require("daisyui"),
    nextui({
      addCommonColors: true,
    }),
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
  themes: {
    fontFamily: {
      custom1: ['"Neulis"', "sans-serif"], // Ensure fonts with spaces have " " surrounding it.
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
      },
    },
  },
  theme: {
    extend: {
      keyframes: {
        animateGlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'glow': 'animateGlow 1.25s linear infinite',
      },
    },
  },

  darkMode: "class",
} satisfies Config;
