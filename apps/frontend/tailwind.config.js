/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "focus-red": "#EF4444",
        "focus-blue": "#2563EB",
        "focus-green": "#059669",
      },
    },
  },
  plugins: [],
};
