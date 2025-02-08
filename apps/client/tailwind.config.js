const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:'Sen'
      },
      colors:{
        'primary':"#0ea5e9",
        'primary-light':"#e0f2fe",
        'primary-dark':"#013C63",

      },
      backgroundColor:{
        '0':"#FFF",
        '100':"#F4F3F1",
        '200': "#E5E5E5"
      },
      backgroundImage:{
        'wave-pattern':"url('assets/wave-pattern-background.svg')"
      },
      boxShadow:{
        'default': '0px 0px 0px 1px inset rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
};
