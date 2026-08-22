import { type FC, createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { tokens } from "./tokens";
import { settings } from "shared/utils/setting";
import { ThemeMode, ThemeContextType, CustomThemeProviderProps } from "shared/types/theme.types";

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "dark",
  toggleTheme: () => {},
});

/**
 * EN: Hook to read the current theme mode and the toggle function from anywhere in the tree.
 * Must be used within a `CustomThemeProvider` (falls back to the default context value of
 * `{ themeMode: "dark", toggleTheme: () => {} }` — a no-op — if used outside one).
 * VI: Hook để đọc theme hiện tại và hàm chuyển đổi theme từ bất kỳ đâu trong cây component.
 * Phải dùng bên trong `CustomThemeProvider` (nếu dùng bên ngoài sẽ nhận giá trị mặc định của
 * context là `{ themeMode: "dark", toggleTheme: () => {} }` — tức không có tác dụng).
 * @returns EN: `{ themeMode, toggleTheme }`. VI: `{ themeMode, toggleTheme }`.
 */
export const useTheme = () => useContext(ThemeContext);

const THEME_COOKIE_KEY = "app_theme_mode";

/**
 * EN: App-wide theme provider. Owns the dark/light `themeMode` state (persisted to a cookie so
 * it survives reloads), toggles the `.dark` class on `<html>` (actual color values live in CSS
 * variables in `src/index.css`, not here — see the note below), and configures antd's
 * `ConfigProvider` so antd components (Button, Modal, Drawer, etc.) follow the same mode:
 * `antdTheme.darkAlgorithm` when dark, `antdTheme.defaultAlgorithm` (antd's light algorithm)
 * when light. The explicit `token` overrides below additionally pin antd's primary/background/
 * text/border colors to this app's brand palette instead of antd's stock defaults.
 *
 * EN (known inconsistency): the color values in `./tokens.ts` are NOT a single source of truth —
 * they only model the dark-mode palette, and that same palette is duplicated by hand in three
 * places: `tokens.ts` (used here for antd tokens), the `.dark { --bg-color: ...; }` block in
 * `src/index.css` (used for Tailwind utility classes via CSS vars), and the hardcoded
 * `primary`/`secondary` hex values in `tailwind.config.js`. The light-mode palette exists only
 * in `index.css`'s `:root {}` block and has no `tokens.ts` equivalent at all (hence the inline
 * light-mode hex fallbacks like `"#FFFFFF"` / `"#1F2937"` below). Changing a brand color today
 * means editing up to three files in sync — this is a real gap, not a designed pattern.
 *
 * VI: Provider theme dùng chung cho cả ứng dụng. Quản lý state `themeMode` (dark/light), lưu vào
 * cookie để giữ nguyên sau khi reload trang, bật/tắt class `.dark` trên `<html>` (giá trị màu
 * thực tế nằm ở CSS variables trong `src/index.css`, không nằm ở đây — xem ghi chú bên dưới),
 * và cấu hình `ConfigProvider` của antd để các component antd (Button, Modal, Drawer, ...) theo
 * cùng chế độ: `antdTheme.darkAlgorithm` khi ở chế độ tối, `antdTheme.defaultAlgorithm` (thuật
 * toán sáng mặc định của antd) khi ở chế độ sáng. Phần `token` override bên dưới còn ghim màu
 * primary/nền/chữ/viền của antd theo bảng màu thương hiệu của app thay vì màu mặc định của antd.
 *
 * VI (điểm chưa nhất quán đã biết): giá trị màu trong `./tokens.ts` KHÔNG phải là nguồn dữ liệu
 * duy nhất (single source of truth) — nó chỉ mô tả bảng màu chế độ tối, và cùng bảng màu đó lại
 * được chép tay ở ba nơi: `tokens.ts` (dùng ở đây cho token của antd), khối `.dark { --bg-color: ...; }`
 * trong `src/index.css` (dùng cho class Tailwind qua CSS var), và các giá trị hex `primary`/`secondary`
 * viết cứng trong `tailwind.config.js`. Bảng màu chế độ sáng chỉ tồn tại trong khối `:root {}` của
 * `index.css` và hoàn toàn không có bản tương ứng trong `tokens.ts` (vì vậy bên dưới phải viết cứng
 * các mã hex cho chế độ sáng như `"#FFFFFF"` / `"#1F2937"`). Muốn đổi một màu thương hiệu hiện tại
 * phải sửa đồng thời tối đa ba file — đây là một khoảng trống thật sự, không phải thiết kế có chủ đích.
 * @param children - EN: subtree that gets theme context + antd ConfigProvider. VI: cây con sẽ nhận theme context + ConfigProvider của antd.
 */
export const CustomThemeProvider: FC<CustomThemeProviderProps> = ({ children }) => {
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
    // Toggle .dark class only — colors are handled by CSS vars in index.css
    // Avoid setting inline styles here as they override CSS and cause CLS
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
