/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        brutal: {
          bg: '#fff8f0',
          yellow: '#FFD800',
          pink: '#FF649C',
          cyan: '#00F0FF',
          blue: '#2B5BFF',
          green: '#00D084',
          black: '#111111',
          white: '#FFFFFF',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(17,17,17,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(17,17,17,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(17,17,17,1)',
      }
    }
  },
  plugins: [],
}
