module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        header: ['Cartridge']
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(70deg)' },
          '50%': { transform: 'rotate(10deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 3s ease-in-out infinite',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};
