import { type FC, createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { tokens } from "./tokens";
import { settings } from "@cinefix/utils";

export type ThemeMode = "dark" | "light";

export interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const THEME_COOKIE_KEY = "app_theme_mode";

export const CustomThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = settings.getCookie(THEME_COOKIE_KEY);
    return savedTheme === "light" ? "light" : "dark";
  });

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      settings.setCookie(THEME_COOKIE_KEY, nextTheme, 365);
      return nextTheme;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeMode]);

  const isDark = themeMode === "dark";

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: tokens.primary,
            colorBgContainer: isDark ? tokens.surface : "#FFFFFF",
            colorText: isDark ? tokens.textPrimary : "#1F2937",
            colorTextDescription: isDark ? tokens.textSecondary : "#4B5563",
            colorBorder: isDark ? tokens.border : "#E5E7EB",
            borderRadius: tokens.borderRadiusButton,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
