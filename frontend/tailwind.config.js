/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundSize:{
        'fit':'100% 100%'
      },
      keyframes: {
        "tourist-background-keyframe": {
          "0%": {
            "background-image":
              'linear-gradient(to bottom,rgba(7, 91, 76, 0) 70%,rgba(7, 91, 76, 1) 100%),url("assets/mosque3.jpeg")',
          },
          '25%':{'opacity':'0.8'},

          "50%": {
            "background-image":
              'linear-gradient(to bottom,rgba(7, 91, 76, 0) 70%,rgba(7, 91, 76, 1) 100%),url("assets/sky.jpeg")',
              'opacity':'1'
          },
          '75%':{'opacity':'0.8'},
          "100%": {
            "background-image":
              'linear-gradient(to bottom,rgba(7, 91, 76, 0) 70%,rgba(7, 91, 76, 1) 100%),url("assets/mosque3.jpeg")',
              'opacity':'1'
          },
        },
      },
      animation:{
        "tourist-background":"tourist-background-keyframe 5s linear infinite"
      }
    },
  },
  plugins: [],
};
