/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-minify-selector')({
      convertToIs: true,
    }),
  ],
}
