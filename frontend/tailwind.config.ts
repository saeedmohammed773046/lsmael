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
          400: '#D4AF37', // Primary Luxury Gold
          500: '#C5A880', // Warm Gold
          600: '#A98741',
          700: '#836729',
          800: '#5F4818',
          900: '#3D2C0C',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F7F3EA',
          200: '#EFE8D8',
          300: '#E5DCB8',
          400: '#D5C9A4',
        },
        obsidian: {
          900: '#121212',
          800: '#1A1A1A',
          700: '#242424',
          600: '#333333',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
