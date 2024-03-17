import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  // ...
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui"), nextui()],
  daisyui: {
    themes: ["light", "dark"],
  },
  darkMode: "class",
} satisfies Config;
