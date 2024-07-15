import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        broadway: ['broadway', 'sans-serif'],
        aliens: ['aliens', 'sans-serif'],
      },
      fontSize: {
        xxl: '1.75rem',
        '7xl': '5rem',
      },
    },
  },
  plugins: [],
};

export default config;
