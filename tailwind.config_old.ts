import type { Config } from "tailwindcss";

export default {
  // ...
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
} satisfies Config;
