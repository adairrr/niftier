import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from 'react-use';

// const theme = window.localStorage.getItem('theme');

// lets use dark mode by default!
interface ThemeContextInterface {
  theme: string;
  setTheme: any; // React.Dispatch<React.SetStateAction<string>>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextInterface>({
  theme: window && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  setTheme: () => null,
  toggleTheme: () => null,
});

ThemeContext.displayName = 'ThemeContext';

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const preferDark = window && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = useLocalStorage('theme', preferDark ? 'dark' : 'light');

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === 'light' ? 'dark' : theme),
    }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default useThemeContext;
