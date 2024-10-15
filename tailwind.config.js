const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,css}",
    "./components/**/*.{js,ts,jsx,tsx,css}",
    "./modules/**/*.{js,ts,jsx,tsx,css}",
    "./packages/chatbox/src/components/**/*.{js,ts,jsx,tsx,css}",
    "./packages/uikit/src/components/**/*.{js,ts,jsx,tsx,css}",
    "./packages/codelearn/src/components/**/*.{js,ts,jsx,tsx,css}",
    "./packages/quiz/src/components/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    screens: {
      xs: "420px",

      sm: "40rem",
      // => @media (min-width: 640px) { ... }

      md: "48rem",
      // => @media (min-width: 768px) { ... }

      screen1024: "64rem",
      // => @media (min-width: 1024px) { ... }

      gmd: "67.5rem",
      // => @media (min-width: 1080px) { ... }

      lg: "73.75rem",
      // => @media (min-width: 1180px) { ... }

      custom: "83rem",
      // => @media (min-width: 1328px) { ... }

      screen1440: "90rem",
      // => @media (min-width: 1440px) { ... }

      xl: "92.5rem",
      // => @media (min-width: 1480px) { ... }
    },
    fontSize: {
      xxs: ["0.625rem", "14px"],
      xs: ["0.75rem", "16px"],
      sm: ["0.875rem", "20px"],
      base: ["1rem", "24px"],
      lg: ["1.125rem", "28px"],
      xl: ["1.250rem", "28px"],
      "2xl": ["1.5rem", "32px"],
      "3xl": ["2rem", "36px"],
      "3.5xl": ["2.25rem", "54px"],
      "4xl": ["2.5rem", "60px"],
    },
    fontFamily: {
      condensed: ["Open Sans Condensed", "Open Sans", "sans-serif"],
      cherish: ["Cherish Moment", "sans-serif"],
    },
    extend: {
      maxWidth: {
        desktop: "1170px",
        150: "150px",
        200: "200px",
        260: "260px",
      },
      width: {
        60: "60px",
        100: "100px",
        120: "120px",
        140: "140px",
        160: "160px",
        180: "180px",
        200: "200px",
        260: "260px",
      },
      height: {
        100: "30rem",
      },
      zIndex: {
        100: "100",
        200: "200",
        900: "900",
      },
      colors: {
        primary: "#2C31CF",
        success: colors.green[600],
        warning: colors.yellow[600],
        danger: colors.red[600],
        gray: {
          primary: "#637381",
          secondary: colors.gray[400],
          lighter: colors.gray[200],
        },
        navy: {
          primary: "#506CF0",
          light: "#7289F3",
          light2: "#a7b5f7",
          light3: "#cad2fa",
          light4: "#dce1fc",
          light5: "#edf0fd",
          dark: "#304090",
        },
        blue: {
          primary: "#2C31CF",
          secondary: "#0078D4",
          light: "#E6F4FF",
        },
        orange: {
          primary: "#FB792B",
          light: "#FFEEE3",
        },
        green: {
          primary: "#05972C",
          secondary: "#13C296",
          light: "#F1F2F2",
        },
        ink: {
          primary: "#182537",
          secondary: "#606060",
          80: "#373A3C",
        },
        smoke: "#F5F5F5",
      },
      boxShadow: {
        "2xl": "0 2px 4px 0 #0000004d",
        xl: "0px 8px 16px rgba(0, 0, 0, 0.15)",
        lg: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        sm: "0px 2px 4px rgba(168, 168, 168, 0.25)",
      },
    },
    keyframes: {
      "primary-move-to-left-keyframes": {
        "0%": { transform: "translate(0, 0)" },
        "100%": { transform: "translate(-100%, 0)" },
      },
      "secondary-move-to-left-keyframes": {
        "0%": { transform: "translate(100%, 0)" },
        "100%": { transform: "translate(0, 0)" },
      },
      "primary-move-to-right-keyframes": {
        "0%": { transform: "translate(0, 0)" },
        "100%": { transform: "translate(100%, 0)" },
      },
      "secondary-move-to-right-keyframes": {
        "0%": { transform: "translate(-100%, 0)" },
        "100%": { transform: "translate(0, 0)" },
      },
    },
    animation: {
      "primary-move-to-left": "primary-move-to-left-keyframes 45s linear infinite",
      "secondary-move-to-left": "secondary-move-to-left-keyframes 45s linear infinite",
      "primary-move-to-right": "primary-move-to-right-keyframes 45s linear infinite",
      "secondary-move-to-right": "secondary-move-to-right-keyframes 45s linear infinite",
    },
  },
  experimental: {
    optimizeCss: true,
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
