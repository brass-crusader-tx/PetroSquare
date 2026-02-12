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
        'surface-card': '#1E293B',      // Card background
        'surface-inset': '#020617',     // Darker inset background (Slate 950)
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

        // Semantic Status Colors (Map to data colors or primary)
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        // Semantic Spacing Scale
        'space-1': '4px',
        'space-2': '8px',
        'space-3': '12px',
        'space-4': '16px',
        'space-6': '24px',
        'space-8': '32px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
