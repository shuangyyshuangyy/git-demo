const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'index.html'),
    join(__dirname, 'src/**/*.{vue,js,ts,jsx,tsx}')
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#000000',
          90: '#1E1E1E',
          80: '#161616',
          50: '#2E2E2E',
          border: '#4F4F4F'
        },
        blue: '#2094FF'
      },
    }
  },
  plugins: []
};
