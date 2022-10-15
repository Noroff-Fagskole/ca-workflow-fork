
module.exports = {
  content: [
    "./*.{html,js}",
    "./js/*.js",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        'mainBeige': '#F4F3F1',
        'white': '#FFFFFF',
        'darkBrown': '#2F2725',
        'lightBrown': '#7D6D6D',
      }, 
      fontFamily: {
        'josefine': 'Josefin Sans',
        'robotoC': 'Roboto Condensed',
        'pretty': 'Times New Roman',
        'lato': 'Lato',
      },
      backgroundImage: {
        'mainBackground': "url('./img/jeppe-monster-_j95TVqh9lg-unsplash.jpg')",
        'mainBackgroundHeader': "url('./img/mainBG_header.jpg')"
      }
    },
  
  }
}