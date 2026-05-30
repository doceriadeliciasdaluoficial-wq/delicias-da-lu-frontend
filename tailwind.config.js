/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rose': '#F4A7B9',      // Rosa rosé
        'cream': '#FDF6EC',      // Creme/bege
        'gold': '#C9A96E',       // Dourado suave
        'off-white': '#FAFAFA',  // Branco off-white
        'chocolate': '#3E1F0D',  // Marrom chocolate
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Lato', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-gentle': 'pulse-gentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
