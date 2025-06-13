// tailwind.config.ts
module.exports = {
    darkMode: 'class',
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#e6fcf5',
            100: '#c3fae8',
            200: '#96f2d7',
            300: '#63e6be',
            400: '#38d9a9', // Main turquoise
            500: '#20c997',
            600: '#12b886',
            700: '#0ca678',
            800: '#099268',
            900: '#087f5b',
          },
          dark: {
            bg: '#0a0a0a',
            surface: '#1a1a1a',
            border: '#2a2a2a',
          }
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
          'slide-up': 'slideUp 0.5s ease-out',
          'fade-in': 'fadeIn 0.5s ease-out',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          glow: {
            '0%': { boxShadow: '0 0 5px #38d9a9, 0 0 10px #38d9a9' },
            '100%': { boxShadow: '0 0 20px #38d9a9, 0 0 30px #38d9a9' },
          },
          slideUp: {
            '0%': { transform: 'translateY(100px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
        },
      },
    },
    plugins: [],
  }