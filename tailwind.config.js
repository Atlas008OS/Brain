/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0F19',
          soft: '#171B26',
        },
        mist: {
          50: '#F5F8FC',
          100: '#EAF1F9',
          200: '#DCE9F7',
        },
        brand: {
          blue: '#3DA9E0',
          teal: '#1FC0B8',
          navy: '#0E1626',
        },
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.08)',
        floating: '0 12px 32px -8px rgba(20, 40, 80, 0.35)',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.12)', opacity: '0.85' },
        },
        pulseSlower: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.35' },
          '50%': { transform: 'scale(1.2)', opacity: '0.6' },
        },
        blobDrift: {
          '0%, 100%': { borderRadius: '48% 52% 58% 42% / 52% 44% 56% 48%' },
          '33%': { borderRadius: '58% 42% 48% 52% / 44% 56% 44% 56%' },
          '66%': { borderRadius: '42% 58% 52% 48% / 56% 48% 52% 44%' },
        },
      },
      animation: {
        pulseSlow: 'pulseSlow 3.2s ease-in-out infinite',
        pulseSlower: 'pulseSlower 4.4s ease-in-out infinite',
        blobDrift: 'blobDrift 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
