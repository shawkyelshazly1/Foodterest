module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        mainBg:
          "url('https://res.cloudinary.com/dwufx31ox/image/upload/v1647942552/Foodterest/jimmy-dean-Yn0l7uwBrpw-unsplash_1_ndifjk.jpg')",
      },
      colors: {
        blackCoverFade: "rgba(0, 0, 0, 0.6)",
      },
      keyframes: {
        heartGrow: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
      },
      animation: {
        heartGrow: "heartGrow 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
