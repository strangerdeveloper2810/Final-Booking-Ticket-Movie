# 07. Tạo kiểu: Tailwind CSS, Design Tokens & antd Theming

## Tại sao lại dùng Tailwind CSS — sự đánh đổi của utility-first

Tailwind CSS đặt cược theo một hướng khác so với hai lựa chọn thay thế truyền thống hơn:

| Cách tiếp cận | Trông như thế nào | Sự đánh đổi |
|---|---|---|
| **CSS/SCSS viết tay** (trạng thái của chính dự án này trước khi tái cấu trúc) | `.wrap-movie { display: flex; ... }` trong một stylesheet riêng, được tham chiếu theo tên class | Toàn quyền kiểm soát, nhưng việc đặt tên là công việc thực sự tốn công, và các rule không dùng đến âm thầm tích tụ thành gánh nặng chết — điều này đã được xác minh trong chính lịch sử của repo này: một phiên bản dựa trên SCSS trước đây có các partial chứa những rule thực sự chết (ví dụ: một selector `.carousel-container` không khớp với bất kỳ className thực tế nào trong toàn bộ ứng dụng) mà không ai nhận ra cho đến khi có một đợt audit rõ ràng. |
| **CSS-in-JS** (styled-components, Emotion) | Style được đặt cùng vị trí với component, tự động được giới hạn phạm vi (scoped) | Có chi phí runtime (việc inject style diễn ra trong JS), và không kết hợp tốt với một thư viện component tự thực hiện styling ở runtime của riêng nó (CSS-in-JS engine của antd v5) — có hai runtime CSS-in-JS trong cùng một ứng dụng là một anti-pattern thực sự cần tránh. |
| **Utility-first (Tailwind)** — cách tiếp cận mà dự án này sử dụng | `className="flex justify-center mt-6"` trực tiếp trong JSX | Không có vấn đề đặt tên (vì không có gì để đặt tên), và các utility class thực sự chết là cực kỳ hiếm về mặt cấu trúc (bạn sẽ phải để sót một chuỗi `className` không dùng đến nằm trong JSX chết, chứ không phải một rule không dùng trong một stylesheet mà chẳng ai đọc) — sự đánh đổi nằm ở khả năng đọc của JSX: markup trở nên dày đặc hơn về mặt hình ảnh, và tính nhất quán phụ thuộc hoàn toàn vào kỷ luật (không có gì ngăn cản hai kỹ sư diễn đạt "8px padding" bằng `p-2` ở file này và bằng `p-[8px]` tùy ý ở file khác). |

Lịch sử di trú (migration) của chính codebase này là một ví dụ sống động cho hai hàng đầu tiên: nó bắt đầu với SCSS viết tay, và có một phát hiện cụ thể từ một buổi review nội bộ trước khi hoàn tất việc chuyển hẳn sang Tailwind, đáng được nhắc lại ở đây như một bài học cảnh báo — hệ thống SCSS đã tích tụ một rule chết, một breakpoint lỗi thời bị trùng lặp ở hai nơi, và một component (`Loading`) đã được thay thế hoàn toàn (`LoadingNew`) trong khi partial stylesheet cũ của nó vẫn tiếp tục được build dưới tên cũ. Không điều nào trong số đó là vấn đề riêng của Tailwind, nhưng đó chính xác là kiểu lỗi mà utility class tránh được nhờ cấu trúc của nó (không có stylesheet riêng nào để bị lệch đồng bộ với component sử dụng nó).

## `tailwind.config.js`, đầy đủ nội dung

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        surface: "var(--surface-color)",
        "surface-hover": "var(--surface-hover-color)",
        border: "var(--border-color)",
        primary: "#F2545B",
        "primary-hover": "#FF6B72",
        secondary: "#FFC857",
        "text-primary": "var(--text-primary-color)",
        "text-secondary": "var(--text-secondary-color)",
      },
      borderRadius: { xl: "10px", lg: "8px" },
    },
  },
  plugins: [],
};
```
Có hai điều đáng để hiểu rõ cụ thể ở đây:

1. **`darkMode: "class"`** (không phải tùy chọn còn lại của Tailwind là `"media"`, vốn theo `prefers-color-scheme` ở cấp hệ điều hành). Điều này có nghĩa là chế độ dark/light được kiểm soát bởi việc class `.dark` có xuất hiện trên `<html>` hay không, được bật/tắt một cách tường minh bởi mã ứng dụng (xem phần theme bên dưới) — chứ không được tự động suy ra từ hệ điều hành. Đây là lựa chọn đúng đắn bất cứ khi nào ứng dụng muốn có một nút chuyển theme do người dùng kiểm soát, thay vì "luôn theo hệ điều hành", và đó chính là trường hợp ở đây (`ThemeContext.tsx` đọc/ghi một cookie để lựa chọn được lưu lại và có thể được thiết lập độc lập với hệ điều hành).
2. **Hầu hết các màu là các gián tiếp `var(--*)`, không phải giá trị hex cố định** — `background`, `surface`, `border`, `text-primary`, `text-secondary` đều được phân giải thông qua các CSS custom properties được định nghĩa ở nơi khác (`src/index.css`). Đây chính là *cách* mà theming dark/light thực sự hoạt động với utility classes của Tailwind: tên class của Tailwind (`bg-background`) không bao giờ thay đổi giữa các theme, chỉ có giá trị của CSS variable bên dưới là thay đổi, được hoán đổi tùy theo sự có mặt/vắng mặt của class `.dark`. **Nhưng `primary`, `primary-hover`, và `secondary` lại là các giá trị hex cố định (hardcoded) ngay tại đây**, chứ không phải `var(--*)` — một sự thiếu nhất quán đáng để ý (xem phần "vấn đề trùng lặp token" bên dưới).

`content: ["./src/**/*.{js,jsx,ts,tsx}"]` là glob content-scanning của Tailwind — nó quét tĩnh các file này để tìm các chuỗi có hình dạng giống tên class, nhằm quyết định utility nào thực sự sẽ được sinh ra, đây là cách Tailwind tránh việc phải đưa mọi utility class có thể có (hàng chục nghìn class) vào CSS cuối cùng — chỉ những class xuất hiện dưới dạng văn bản thực sự ở đâu đó trong một file được quét mới lọt vào output. Điều này kéo theo một hệ quả nổi tiếng đáng biết: **các chuỗi tên class được xây dựng động** (ví dụ: `` `text-${color}-500` ``) sẽ không được phát hiện bởi lần quét này và sẽ không được sinh ra — Tailwind chỉ có thể nhìn thấy các chuỗi tên class trọn vẹn, hiện diện theo nghĩa đen (literal) trong mã nguồn của bạn.

## Design tokens: kế hoạch so với những gì thực sự được triển khai

`docs/refactor/design-plan.md` (một tài liệu lập kế hoạch trước đây trong repo này) đã nêu rõ một ý định: *"Một nguồn token duy nhất. Colors, radii, và font scale được định nghĩa một lần và được dùng chung bởi cả Tailwind lẫn antd... lấy từ cùng một constants object để chúng không bao giờ có thể lệch nhau."*

**Việc triển khai thực tế đã đi chệch khỏi kế hoạch đó.** Ở phiên bản đã triển khai, có **ba** bản sao của cùng một bảng màu (palette) được duy trì độc lập với nhau:

1. **`src/shared/theme/tokens.ts`** — một object TS thuần (chỉ chứa các giá trị dành cho dark mode):
   ```typescript
   export const tokens = {
     background: "#0B0D12", surface: "#151822", surfaceHover: "#1D2130", border: "#262B3A",
     primary: "#F2545B", primaryHover: "#FF6B72", secondary: "#FFC857",
     textPrimary: "#F5F6FA", textSecondary: "#9AA0B4",
     success: "#52c41a", danger: "#ff4d4f",
     borderRadiusCard: 10, borderRadiusButton: 8,
   };
   ```
2. **Các CSS custom properties trong `src/index.css`** — các giá trị hex được sao chép thủ công, được định nghĩa riêng cho **cả hai** chế độ light (`:root`) và dark (`.dark`) (các giá trị của light mode hoàn toàn không có đối chiếu nào trong `tokens.ts`, vì file đó chỉ mô hình hóa bảng màu dark).
3. **Các giá trị hex hardcode trực tiếp trong `tailwind.config.js`** (`primary: "#F2545B"`, `"primary-hover": "#FF6B72"`, `secondary: "#FFC857"`) và một lần nữa trong `src/index.css` (ví dụ: một override cho `.ant-tabs-tab-active` và một rule dots-active-color của slick-carousel) — cả hai đều khớp với các giá trị trong `tokens.ts` nhờ copy-paste thủ công, chứ không phải bằng import.

Hiện tại không có gì *sinh ra* (2) hoặc (3) từ (1) — chúng có thể, và trên thực tế đã một phần, bị lệch nhau (light mode hoàn toàn không được thể hiện trong `tokens.ts`). **Điều này được trình bày ở đây như một ví dụ thực tế, cụ thể về một ý định đã được ghi lại nhưng không được triển khai trọn vẹn** — hữu ích chính vì đây là kiểu lệch pha rất dễ phát sinh dù có ý định tốt, và rất dễ bị bỏ sót khi review, chứ không phải vì ai đó đã làm điều gì bất hợp lý. Nếu bạn đụng vào bảng màu, việc cần làm một cách trung thực là: chọn một trong ba nơi này làm nguồn thực sự, sinh ra hoặc import các nơi còn lại từ đó, và xóa bỏ các bản sao trùng lặp.

## Theming của antd: `ConfigProvider` + `ThemeContext`

antd v5 (khác với v4) tự style chính nó chủ yếu thông qua một CSS-in-JS engine chạy ở runtime, được điều khiển bởi prop `ConfigProvider theme`, chứ không phải bằng các biến Less được biên dịch sẵn — và chính điều này là thứ khiến việc chia sẻ token với Tailwind trở nên khả thi ngay từ đầu (không có bước build Less riêng biệt nào cần phải giữ đồng bộ thêm).

```tsx
// src/shared/theme/ThemeContext.tsx (relevant excerpt)
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
```
`algorithm: darkAlgorithm | defaultAlgorithm` là cơ chế tích hợp sẵn của riêng antd để suy ra toàn bộ một hệ thống màu nhất quán (hover state, disabled state, shadow) từ một tập nhỏ các seed token — bạn không cần tự tay chỉ định màu dark-mode cho từng antd component, thuật toán sẽ tự suy ra các giá trị hợp lý từ `colorPrimary`/`colorBgContainer`/v.v. Lưu ý rằng các giá trị light-mode ở đây (`"#FFFFFF"`, `"#1F2937"`, `"#4B5563"`, `"#E5E7EB"`) là các giá trị literal viết trực tiếp inline, hoàn toàn không lấy từ `tokens.ts` (củng cố thêm điểm đã nêu ở trên — `tokens.ts` ngày nay thực chất là một file chỉ dành cho dark-mode, dù tên gọi của nó mang tính tổng quát).

### Cách công tắc chuyển theme tránh được hiện tượng nhấp nháy sai theme

`public/index.html` chạy một **`<script>` inline, đồng bộ (synchronous)** nhỏ trong `<head>`, trước khi bất kỳ CSS hay React bundle nào được tải:
```html
<script>
  (function () {
    try {
      var c = document.cookie.match(/app_theme_mode=([^;]+)/);
      var t = c ? c[1] : "dark";
      if (t !== "light") document.documentElement.classList.add("dark");
    } catch (e) {}
  })();
</script>
```
Đây là một kỹ thuật nổi tiếng để tránh FOUC/CLS (flash of unstyled content / cumulative layout shift) do việc chuyển theme gây ra: nếu class `.dark` chỉ được thêm vào sau khi React mount và `ThemeContext` khởi tạo xong, một người dùng quay lại ở dark mode sẽ thấy nhấp nháy màu của light theme trước tiên. Việc đọc một cookie thuần túy một cách đồng bộ trong một inline script chặn (blocking), trước cả khi stylesheet phụ thuộc vào `.dark` có cơ hội paint, sẽ khép lại khoảng hở đó. Đây cũng là *lý do* vì sao lựa chọn theme được lưu trong một **cookie** thay vì `localStorage` ở đây — một cookie có thể đọc được đồng bộ ở vị trí này theo đúng cách mà bất kỳ loại lưu trữ nào cũng có thể, nhưng cơ chế cụ thể (một phép so khớp chuỗi thuần túy, không phải parse JSON) đủ đơn giản để chạy an toàn ở giai đoạn sớm này, được bọc trong một `try`/`catch` phòng trường hợp cookie bị vô hiệu hóa.

## Hướng dẫn thực tiễn cho codebase này

- Ưu tiên dùng Tailwind utility classes cho bất cứ điều gì liên quan đến layout/spacing; dùng các antd component (không phải HTML thô) cho bất cứ điều gì có hành vi tương tác thực sự — xem chính việc dự án này đã chuyển từ các phần tử `<input>`/`<button>` thô sang dùng `Form`/`Input`/`Button` của antd (được ghi lại trong [doc 08](./08-forms-react-hook-form-zod.md)).
- Nếu bạn thêm một màu mới vào bảng màu, hãy coi `tokens.ts` là nguồn chân lý (source of truth) dự kiến theo đúng kế hoạch thiết kế ban đầu, và lan truyền thủ công giá trị đó sang các CSS variable trong `index.css` cũng như `tailwind.config.js`, cho đến khi có ai đó thực sự thiết lập một cơ chế single-source thực thụ (ví dụ: sinh ra file CSS variable và một phần `theme.extend.colors` của `tailwind.config.js` từ `tokens.ts` tại thời điểm build) — đừng thêm một bản sao độc lập thứ tư.
- Hãy nhớ giới hạn của cơ chế content-scanning của Tailwind: không bao giờ xây dựng tên class bằng cách nối chuỗi/nội suy (interpolation) nếu bạn muốn Tailwind thực sự sinh ra nó.
