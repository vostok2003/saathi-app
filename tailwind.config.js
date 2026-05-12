/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'pb-emergency',
    'emergency-bar-wrap',
    'app-shell',
    'desktop-sidebar',
    'screen-enter',
    'min-h-full',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'base': ['18px', '1.7'],
        'lg':   ['20px', '1.7'],
        'xl':   ['22px', '1.6'],
        '2xl':  ['26px', '1.5'],
        '3xl':  ['30px', '1.4'],
        '4xl':  ['36px', '1.3'],
        '5xl':  ['44px', '1.2'],
      },
      colors: {
        cream: {
          50:  '#FDFBF7',
          100: '#FAF7F0',
          200: '#F5EFE0',
          300: '#EDE3CC',
        },
        charcoal: {
          800: '#1C1C1E',
          700: '#2C2C2E',
          600: '#3A3A3C',
          500: '#48484A',
        },
        sage: {
          500: '#5C7A5C',
          600: '#4A6741',
          700: '#3A5232',
        },
        amber: {
          400: '#F5A623',
          500: '#E8960F',
        },
        rose: {
          600: '#C0392B',
          700: '#A93226',
        },
      },
      minHeight: {
        touch: '64px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:       '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.14)',
      },
      spacing: {
        emergency: '96px',
      },
    },
  },
  plugins: [],
}
