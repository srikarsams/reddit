/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: false,
    fontFamily: {
      body: ['IBM Plex Sans'],
    },
    extend: {
      backgroundImage: {
        'register-background': "url('/images/register-background.jpeg')",
      },
      colors: {
        blue: {
          100: '#cce4f6',
          200: '#99c9ed',
          300: '#66afe5',
          400: '#3394dc',
          500: '#0079d3',
          600: '#0061a9',
          700: '#00497f',
          800: '#003054',
          900: '#00182a',
        },
        reddit: {
          100: '#DAE0E6',
        },
      },
      spacing: {
        70: '17.5rem',
        160: '40rem',
      },
      backgroundColor: {
        input: 'rgb(252, 252, 251)',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          '@screen sm': {maxWidth: '640px'},
          '@screen md': {maxWidth: '768px'},
          '@screen lg': {maxWidth: '975px'},
        },
      });
    },
  ],
};
