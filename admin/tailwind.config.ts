import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF6EE',
          100: '#F3EAD5',
          200: '#E7D5AA',
          300: '#DABF7E',
          400: '#D4AF37',
          500: '#C5A880',
          600: '#A98741',
          700: '#836729',
          800: '#5F4818',
          900: '#3D2C0C',
        },
        obsidian: {
          950: '#0D0D0D',
          900: '#141414',
          800: '#1F1F1F',
          700: '#2A2A2A',
          600: '#3D3D3D',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
