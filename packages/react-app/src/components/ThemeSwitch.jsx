import React, { useEffect, useState, useContext } from "react";
import { Switch } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { ThemeContext } from '../contexts';
// import { updateWeb3ModalTheme } from './WalletConnect';

export default function ThemeSwitcher({ web3Modal }) {

  const { theme, setTheme } = useContext(ThemeContext)

  const [ isDarkMode, setIsDarkMode ] = useState(theme !== 'light');
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  useEffect(() => {
    window.localStorage.setItem("theme", currentTheme);
    // update the modal theme
    // if (web3Modal) updateWeb3ModalTheme(currentTheme);
  }, [currentTheme]);

  const toggleTheme = (isChecked) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
    setTheme(isChecked ? 'dark' : 'light');
  };

  // Avoid theme change flicker
  // if (status === "loading") {
  //   return null;
  // }

  return (
    <div className="main fade-in" style={{position:"fixed",right:8,bottom:8}}>
      <span style={{padding:8}}>{currentTheme === "light" ? "☀️" : "🌜"}</span>
      <Switch checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
}
