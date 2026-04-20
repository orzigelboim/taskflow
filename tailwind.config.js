/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#0E0907',
          card:     '#160D07',
          elevated: '#1E1209',
          overlay:  '#261609',
        },
        border: '#321A0C',
        tx: {
          primary:   '#F5EAD8',
          secondary: '#A07850',
          muted:     '#5E3D24',
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
