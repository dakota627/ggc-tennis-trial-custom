import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        yellow: '#FFFA00',
        'blue-powder': '#E8EDF4',
        'yellow-butter': '#F7EEB4',
        'pink-blush': '#FAD1D3',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Gilroy', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        full: '300px',
      },
    },
  },
  plugins: [],
}
export default config
