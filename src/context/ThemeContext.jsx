import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Check localStorage for saved theme, default to "sasuke" as requested by user
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem("lov_portal_theme");
      return saved || "sasuke"; // Default to "sasuke"
    } catch {
      return "sasuke";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-sasuke", "theme-classic");
    root.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem("lov_portal_theme", theme);
    } catch (e) {
      console.warn("Could not save theme preference:", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "sasuke" ? "classic" : "sasuke"));
  };

  const setTheme = (newTheme) => {
    if (newTheme === "sasuke" || newTheme === "classic") {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isSasuke: theme === "sasuke",
        isClassic: theme === "classic",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
