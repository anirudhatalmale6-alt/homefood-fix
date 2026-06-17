/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-themer')({
      defaultTheme: {
        extend: {
          colors: {
            primary: '#c0392b',
            'primary-hover': '#a33225',
            accent: '#f4b400',
            cream: '#fff8f0',
            charcoal: '#2c2c2c',
            basil: '#4caf50',
            beige: '#f5e6d3',
          },
          fontFamily: {
            display: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          },
        },
      },
      themes: [
        {
          name: 'festive',
          extend: {
            colors: {
              primary: '#9b2335',
              'primary-hover': '#7d1c2b',
              accent: '#d4af37',
              beige: '#efe2d3',
              cream: '#fff9f3',
            },
          },
        },
      ],
    }),
  ],
}
