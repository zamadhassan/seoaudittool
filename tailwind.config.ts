import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'Outfit', 'ui-sans-serif', 'system-ui']
      },
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
