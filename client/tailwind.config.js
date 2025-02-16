module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10a37f',
        secondary: '#202123',
        accent: '#343541',
        'content-primary': '#ececf1',
        'content-secondary': '#8e8ea0'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
}