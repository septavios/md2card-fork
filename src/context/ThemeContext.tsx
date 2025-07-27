import React, { createContext, useContext, useState, useEffect } from 'react';
import { appleNotesTheme } from '../themes/appleNotesTheme';

export type Theme = Record<string, string>;

const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: appleNotesTheme, setTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(appleNotesTheme);

  useEffect(() => {
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value as string);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 