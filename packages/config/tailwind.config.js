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
        background: '#0F172A', // Slate 900
        surface: '#1E293B',    // Slate 800
        'surface-highlight': '#334155', // Slate 700
        border: '#334155',     // Slate 700

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
        // Ensuring standard scale is available, plus any specific semantic spacing if needed
        // For now, standard Tailwind spacing is sufficient, but explicit scale is enforced by usage
      },
    },
  },
  plugins: [],
};
