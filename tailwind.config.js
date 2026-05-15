/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#26c4c9',
          gold: '#26c4c9',
          dark: '#000000',
          light: '#ffffff',
          cyan: '#26c4c9',
        },
        // Cores semânticas via CSS vars
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-muted': 'var(--color-on-surface-muted)',
        'border-base': 'var(--color-border)',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #26c4c9, 0 0 10px #26c4c9' },
          '100%': { boxShadow: '0 0 20px #26c4c9, 0 0 40px #26c4c9' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
