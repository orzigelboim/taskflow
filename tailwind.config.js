/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#FFFFFF',
          card:     '#FFF8F2',
          elevated: '#FFF0E4',
          overlay:  '#FFE8D4',
        },
        border: '#F0C8A8',
        tx: {
          primary:   '#1A0800',
          secondary: '#7A3E18',
          muted:     '#C07840',
        },
        logo: {
          red:    '#D8131D',
          redor:  '#DD3A1E',
          orange: '#E2611E',
          gold:   '#EBAF20',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.25s ease-out',
        'fade-in':  'fadeIn 0.15s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
