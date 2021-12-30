module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        header: ['Cartridge'],
      },
      keyframes: {
        key_wiggle: {
          '0%, 100%': { transform: 'rotate(70deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        gear: {
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        key_wiggle: 'key_wiggle 3s ease-in-out infinite',
        gear: 'gear 10s infinite linear',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
