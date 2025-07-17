/** @type {import('tailwindcss').Config} */
export default {
  prefix: "tw-",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'oxford-blue': '#0B132B',
        'space-cadet': '#1C2541',
        'yinmn-blue': '#3A506B',
        'verdigris': '#5BC0BE',
        'white': '#FFFFFF',
      },
      animation: {
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
};