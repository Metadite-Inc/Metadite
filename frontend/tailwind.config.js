/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",          // Root HTML file
    "./src/**/*.{js,ts,jsx,tsx}"  // All JS/TS files in src
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))', // Define the custom background color
        foreground: 'hsl(var(--foreground))', // Define the custom foreground color
        border: 'hsl(var(--border))', // Add your custom border color
      },
    },
  },
  plugins: [],
}