/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customGreen: '#02735F', // Your custom green color
        darkerGreen: '#075B4C', 
        first: "#1a2b49",
        second: "#526D82",
        third: "#9DB2BF",
        fourth: "#DDE6ED",
        bg: "#f9f9f9",
        fifth: "#686d7e",
      },
      keyframes: {
        "tourist-background-keyframe": {
          "0%": {
            "background-image":
                'linear-gradient(to bottom,rgba(73, 105, 137, 0) 70%,rgba(73, 105, 137, 1) 100%),url("assets/WelcomePhotos/mosque3.jpeg")',
          },
          '25%': { 'opacity': '0.8' },

          "50%": {
            "background-image":
                'linear-gradient(to bottom,rgba(73, 105, 137, 0) 70%,rgba(73, 105, 137, 1) 100%),url("assets/WelcomePhotos/sky.jpeg")',
            'opacity': '1'
          },
          '75%': { 'opacity': '0.8' },
          "100%": {
            "background-image":
                'linear-gradient(to bottom,rgba(73, 105, 137, 0) 70%,rgba(73, 105, 137, 1) 100%),url("assets/WelcomePhotos/mosque3.jpeg")',
            'opacity': '1'
          },
        },
      },
      animation: {
        "tourist-background": "tourist-background-keyframe 5s linear infinite"
      },
      backgroundSize: {
        'fit': '100% 80%',
      },
    },
  },
  plugins: [],
};
