import { ButtonStylesParams, MantineThemeOverride } from "@mantine/core";

const theme: MantineThemeOverride = {
  fontFamily: "Muli, Open Sans, sans-serif",
  black: "#182537",
  white: "#fff",
  headings: { fontFamily: "Muli, Open Sans, sans-serif" },
  // primaryColor: "#045FBB",
  colors: {
    brand: [
      "rgb(231, 245, 255)",
      "rgba(208, 235, 255, 0.65)",
      "#2C31CF",
      "#2C31CF",
      "#2C31CF",
      "#506CF0",
      "#506CF0",
      "#506CF0",
    ],
  },
  primaryColor: "brand",
  lineHeight: 1.5,
  components: {
    Button: {
      styles: (theme, params: ButtonStylesParams) => ({
        // Shared button styles are applied to all buttons
        filled: {
          // subscribe to component params
          //backgroundColor: theme.colors[theme.primaryColor][8],
          color: theme.colors[params.color || theme.colors.gray[0]],
          ":hover": {
            backgroundColor: theme.colors[theme.primaryColor][9],
          },
        },

        // These styles are applied only to buttons with outline variant
        outline: {
          // You can use any selectors inside (the same way as in createStyles function)
          "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        },
      }),
    },

    Badge: {
      // Use raw styles object if you do not need theme dependency
      styles: {
        root: { borderWidth: 2 },
      },
    },
  },
};

export default theme;
