import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "modern" | "dnd";

interface ThemeContextType {
  theme: Theme;
  isDnd: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "modern",
  isDnd: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("app-theme");
    return saved === "dnd" ? "dnd" : "modern";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "modern" ? "dnd" : "modern"));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDnd: theme === "dnd", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
