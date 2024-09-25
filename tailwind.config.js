const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: ['./index.html', './src/**/*.{vue,ts}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
  safelist: [
    {
      pattern: /(bg|border|stroke)-(green|amber|blue)-(200|300)/
    }
  ]
}
