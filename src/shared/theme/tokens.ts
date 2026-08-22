/**
 * EN: Design tokens consumed by `ThemeContext.tsx` to configure antd's `ConfigProvider`. Despite
 * the name, this is NOT a single source of truth for the app's colors — it only models the
 * dark-mode palette. The same hex values are duplicated by hand in `src/index.css`'s `.dark {}`
 * block (for Tailwind utility classes via CSS variables), and `primary`/`secondary` are also
 * hardcoded again in `tailwind.config.js`. There is no light-mode equivalent of this object at
 * all — light-mode colors live only in `index.css`'s `:root {}` block and as inline hex literals
 * in `ThemeContext.tsx`. Keep all of these in sync by hand when changing a brand color.
 * VI: Bộ design token dùng ở `ThemeContext.tsx` để cấu hình `ConfigProvider` của antd. Dù tên gọi
 * như vậy, đây KHÔNG phải nguồn dữ liệu màu duy nhất của app — nó chỉ mô tả bảng màu chế độ tối.
 * Cùng các giá trị hex này lại được chép tay trong khối `.dark {}` của `src/index.css` (dùng cho
 * class Tailwind qua CSS variable), và `primary`/`secondary` cũng được viết cứng lại trong
 * `tailwind.config.js`. Hoàn toàn không có bản tương ứng cho chế độ sáng ở object này — màu chế độ
 * sáng chỉ tồn tại trong khối `:root {}` của `index.css` và các giá trị hex viết cứng trong
 * `ThemeContext.tsx`. Khi đổi một màu thương hiệu, phải tự tay đồng bộ tất cả các nơi trên.
 */
export const tokens = {
  background: "#0B0D12",
  surface: "#151822",
  surfaceHover: "#1D2130",
  border: "#262B3A",
  primary: "#F2545B",
  primaryHover: "#FF6B72",
  secondary: "#FFC857",
  textPrimary: "#F5F6FA",
  textSecondary: "#9AA0B4",
  success: "#52c41a",
  danger: "#ff4d4f",
  borderRadiusCard: 10,
  borderRadiusButton: 8,
};
