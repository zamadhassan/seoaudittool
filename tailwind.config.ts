import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nexora: {
          black: '#0D0D0D',
          yellow: '#FECB2F'
        }
      }
    }
  },
  plugins: []
}

export default config
