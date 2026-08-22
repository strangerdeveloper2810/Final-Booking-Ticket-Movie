import { ReactNode } from "react";

export type ThemeMode = "dark" | "light";

export interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

export interface CustomThemeProviderProps {
  children: ReactNode;
}
