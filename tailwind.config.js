/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        dnd: ['"Jersey 10"', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#F9F5EB',
          100: '#F2EBD4',
          200: '#EBE2C4',
          300: '#E3D5AB',
          400: '#D4C095',
          500: '#C4AB80',
          600: '#8C7456',
          700: '#5C4838',
          800: '#423226',
          900: '#2A1F18',
        },
        dragon: {
          red: '#8A2C2C',
          gold: '#D4AF37',
        },
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
        'rpg': '2px 2px 0px 0px rgba(66, 50, 38, 0.2)',
        'rpg-hover': '3px 3px 0px 0px rgba(66, 50, 38, 0.4)',
        'deep': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      zIndex: {
        15: "15",
      },
    },
  },
  plugins: [],
};
