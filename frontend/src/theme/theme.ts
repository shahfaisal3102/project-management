import { createTheme } from "@mantine/core";

export const appTheme = createTheme({
  primaryColor: "blue",

  fontFamily: "Inter, sans-serif",

  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },

  defaultRadius: "md",

  cursorType: "pointer",
});