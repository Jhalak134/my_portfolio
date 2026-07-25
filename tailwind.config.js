/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          cream: '#F5F0E8',
          surface: '#EDE8DF',
          border: '#D4C9B8',
          badge: '#E0D9CC',
          sand: '#D8CCBA',
          stone: '#DDD5C8',
        },
        status: {
          done: '#C8D8C0',
          progress: '#D8CCBA',
          paused: '#DDD5C8',
        },
        text: {
          primary: '#2C2A27',
          secondary: '#7A736A',
        },
      },
    },
  },
  plugins: [],
}
