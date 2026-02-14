/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // "Deep Graphite" / Charcoal Palette
        background: '#0B1221', // Custom Deep Graphite (Darker than Slate 900)
        surface: '#151E32',    // Custom Surface (Rich Charcoal)
        'surface-highlight': '#2A3650', // Lighter interaction state
        border: '#2A3650',     // Matching highlight for borders

        // Data visualization colors
        'data-positive': '#10B981', // Emerald 500
        'data-warning': '#F59E0B',  // Amber 500
        'data-critical': '#EF4444', // Red 500
        'data-neutral': '#94A3B8',  // Slate 400

        // Semantic aliases
        primary: '#3B82F6',    // Blue 500
        secondary: '#64748B',  // Slate 500
        text: '#F8FAFC',       // Slate 50
        muted: '#94A3B8',      // Slate 400
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        // Ensuring standard scale is available
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
