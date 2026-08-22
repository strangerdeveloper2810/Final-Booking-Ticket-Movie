import { ReactNode } from "react";

// EN: The only two supported UI theme modes; drives both the Tailwind `.dark` class toggle and
// antd's `ConfigProvider` algorithm switch (see `ThemeContext.tsx`).
// VI: Hai chế độ giao diện duy nhất được hỗ trợ; quyết định cả việc bật/tắt class `.dark` của
// Tailwind lẫn việc chuyển thuật toán `ConfigProvider` của antd (xem `ThemeContext.tsx`).
export type ThemeMode = "dark" | "light";

/**
 * EN: Shape of the value exposed by `ThemeContext` / `useTheme()` — the current mode plus a
 * function to flip it.
 * VI: Kiểu dữ liệu của giá trị mà `ThemeContext` / `useTheme()` cung cấp — chế độ hiện tại và
 * hàm để đảo chế độ.
 */
export interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

/**
 * EN: Props for `CustomThemeProvider` — just the subtree that should receive theme context.
 * VI: Props cho `CustomThemeProvider` — chỉ gồm cây con sẽ nhận theme context.
 */
export interface CustomThemeProviderProps {
  children: ReactNode;
}
