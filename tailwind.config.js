/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soft blush-cream pâtisserie backgrounds
        cream: '#FFF8F6',
        vanilla: '#FCE8EF',
        // Raspberry / macaron pink = primary accent (token name "gold" kept for compatibility)
        gold: {
          DEFAULT: '#D6457F',
          light: '#F4A6C2',
          dark: '#B02E66',
        },
        // Cherry red (rose.deep = danger / debt signal)
        rose: {
          DEFAULT: '#E11D48',
          deep: '#9F1239',
        },
        // Lavender macaron accent
        lavender: {
          DEFAULT: '#9B7FD6',
          deep: '#7A5CC0',
        },
        // Dark chocolate — high-contrast text, sidebar & overlays
        chocolate: '#2E1A17',
        // Caramel (warning)
        caramel: '#C68B3E',
        // Pistachio (success)
        pistachio: '#5E9E5A',
        // Butter / vanilla gold
        sun: '#F2C77E',
        text: {
          primary: '#3A1E1B',
          secondary: '#6B4843',
          muted: '#A88A86',
          light: '#FFF8F6',
        },
      },
      fontFamily: {
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #4A2A25 0%, #8E2F5A 38%, #D6457F 74%, #F4A6C2 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #2E1A17 0%, #4A2A25 52%, #3A211D 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #FFF8F6 100%)',
        'gradient-button': 'linear-gradient(135deg, #E9739F 0%, #D6457F 50%, #B02E66 100%)',
        'gradient-rose': 'linear-gradient(135deg, #F58BA0 0%, #E11D48 50%, #9F1239 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #C9B6EC 0%, #9B7FD6 50%, #7A5CC0 100%)',
        'gradient-mint': 'linear-gradient(135deg, #B5DDA4 0%, #5E9E5A 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 248, 246,0.92) 0%, rgba(252, 232, 239,0.75) 100%)',
      },
      boxShadow: {
        card: '0 4px 24px rgba(46, 26, 23, 0.08), 0 1px 4px rgba(46, 26, 23, 0.04)',
        hover: '0 10px 34px rgba(176, 46, 102, 0.18), 0 2px 8px rgba(46, 26, 23, 0.08)',
        gold: '0 8px 24px rgba(214, 69, 127, 0.42)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.1rem',
      },
    },
  },
  plugins: [],
};
