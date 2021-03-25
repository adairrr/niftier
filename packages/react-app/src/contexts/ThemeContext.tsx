import React, { createContext } from "react"

const theme = window.localStorage.getItem("theme");

// lets use dark mode by default!
const ThemeContext = createContext({
  theme: theme ? theme : 'dark',
  setTheme: () => {},
});

export default ThemeContext;
