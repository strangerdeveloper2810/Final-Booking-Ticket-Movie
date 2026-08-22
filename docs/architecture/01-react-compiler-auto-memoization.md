# 01. React 19 & React Compiler Auto-Memoization

## Lý thuyết: vấn đề mà giải pháp này giải quyết

Trước React 19, để tránh việc re-render lãng phí trong một cây component, ta phải chủ động báo cho React biết những gì *không* cần tính toán lại:

- `React.memo(Component)` — bỏ qua việc re-render một component nếu props của nó bằng nhau (shallow-equal) so với lần trước.
- `useCallback(fn, deps)` — giữ nguyên tham chiếu hàm giữa các lần render trừ khi `deps` thay đổi, để các component con được bọc trong `React.memo` không thấy một prop "mới" ở mỗi lần render.
- `useMemo(fn, deps)` — cache một giá trị tính toán tốn kém giữa các lần render trừ khi `deps` thay đổi.

Cách này có hiệu quả, nhưng tồn tại ba kiểu lỗi đã được biết đến rộng rãi:
1. **Chi phí phát sinh (Overhead).** Mỗi component nhạy cảm về hiệu năng cần thêm 2-3 hook và một dependency array, đây là phần thủ tục thuần túy so với logic nghiệp vụ thực sự.
2. **Lỗi stale-closure.** Nếu bạn quên một giá trị trong dependency array của `useCallback`/`useMemo`, hàm/giá trị đã memoized sẽ âm thầm tiếp tục tham chiếu đến một giá trị cũ — đây là một loại lỗi đặc thù của việc memoization thủ công, không tồn tại nếu bạn không bao giờ memoize.
3. **Áp lực bộ nhớ/GC do memoize quá mức.** Việc bọc mọi thứ "cho chắc" tạo ra nhiều object được giữ lại (retained objects) hơn cả chi phí của các lần re-render mà nó vốn định ngăn chặn.

**React Compiler** (được phát hành dưới dạng `babel-plugin-react-compiler`, vẫn đang ở giai đoạn beta tính đến thời điểm phiên bản phụ thuộc được ghim trong codebase này — `^19.0.0-beta-e552027-20250112` trong `package.json`) loại bỏ hoàn toàn quyết định này khỏi tay lập trình viên. Đây là một phép biến đổi Babel AST chạy tại thời điểm build, không phải một thư viện runtime: với mỗi hàm component/hook, nó thực hiện phân tích dataflow để xác định giá trị nào có thể thay đổi giữa các lần render và giá trị nào được suy ra từ đầu vào nào, sau đó **viết lại phần thân của hàm** để chèn vào phần tương đương của memoization thủ công một cách tự động. Nếu nó không thể chứng minh rằng một biểu thức cụ thể là an toàn để memoize (ví dụ: không thể đảm bảo "Rules of React" được tuân thủ — không mutate props/state bên ngoài chính quá trình render, không có side effect không được theo dõi trong khi render), nó đơn giản là để biểu thức đó không được memoize thay vì mạo hiểm gây ra hành vi sai. Nó không bao giờ khiến code của bạn *kém chính xác* hơn; trường hợp xấu nhất là nó chỉ đơn giản không giúp ích ở một chỗ mà nó không thể chứng minh là an toàn.

## Tại sao codebase này sử dụng nó

Đã được xác minh bằng cách grep toàn diện qua mọi file `.tsx`/`.ts` trong `src/`: **không có bất kỳ lần xuất hiện nào của `useCallback`, `useMemo`, hay `React.memo` trong toàn bộ codebase.** Đây là một quy ước có chủ đích, được áp dụng nhất quán, không phải là một sự sơ suất — nhóm phát triển viết các hàm thuần túy (plain functions) và các object/array literal thuần túy trực tiếp trong phần thân component, và để trình biên dịch xử lý việc memoization. Dưới đây là một vài ví dụ thực tế về đoạn code mà, trong một codebase React 18 thời kỳ trước Compiler, gần như chắc chắn sẽ được bọc trong một memoization hook, nhưng ngày nay thì... không:

- **`src/shared/components/Header/Header.tsx`** — `handleNavClick`, `handleLogOut`, và `changeLanguage` là các hàm thuần túy được định nghĩa lại ở mỗi lần render và được truyền thẳng vào các prop `onClick` của các mục menu `NavLink`/`Button`/`Dropdown`. `languageMenuItems` và `navLinks` là các array-of-object literal (mỗi phần tử chứa một closure `onClick` nội tuyến) được tạo lại ở mỗi lần render — chúng được đưa vào prop `menu` của `Dropdown` trong antd, mà việc thay đổi định danh (identity churning) của nó thông thường sẽ là lý do chính đáng để dùng `useMemo`.
- **`src/features/home/components/TMDBMovieSection.tsx`** — `sliderSettings`, một object literal khá lớn với một mảng `responsive` lồng bên trong, được tạo lại ở mỗi lần render và spread trực tiếp vào `<Slider {...sliderSettings}>`. Đây là một "mồi câu" (bait) kinh điển cho `useMemo`, nhưng được để lại dưới dạng một literal trần trụi.
- **`src/features/home/components/CarouselHome.tsx`** và **`ListMovie.tsx`** — các hàm hỗ trợ render (render-helper) và trình xử lý sự kiện nội tuyến được định nghĩa mới ở mỗi lần render mà không cần `useCallback`.

## Cách nó được tích hợp vào quá trình build

Không có file `babel.config.js`/`.babelrc` nào trong repo này — toàn bộ cấu hình Babel nằm trực tiếp bên trong các tùy chọn (options) của webpack loader, trong `config/webpack.common.js`:

```javascript
// config/webpack.common.js
{
  test: /\.(ts|tsx|js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      cacheCompression: false,
      presets: [
        "@babel/preset-env",
        ["@babel/preset-react", { runtime: "automatic" }],
        "@babel/preset-typescript",
      ],
      plugins: [
        ["babel-plugin-react-compiler", { target: "19" }],
      ],
    },
  },
},
```

`target: "19"` báo cho trình biên dịch biết những API runtime nào của React mà nó có thể giả định là khả dụng khi phát ra (emit) các helper memoization của nó. `@babel/preset-typescript` trong cùng pipeline đang thực hiện một việc không liên quan nhưng đáng được lưu ý ở đây vì nó nằm ngay bên cạnh: nó loại bỏ cú pháp TypeScript để Babel có thể xử lý `.tsx`, nhưng nó **không** kiểm tra kiểu (type-check) bất kỳ điều gì — xem [tài liệu 10](./10-typescript-safety-and-cicd-gaps.md) để hiểu vì sao điều này quan trọng.

## Đánh đổi kỹ thuật, nói thẳng ra

**Lợi ích thực tế đã đạt được ở đây:**
- Mọi component trong `src/features/*/components` và `src/features/*/pages` đều dễ đọc hơn một cách rõ rệt — không có việc quản lý dependency array cạnh tranh sự chú ý với logic UI thực sự.
- Không thể xảy ra lỗi stale-closure từ memoization thủ công, vì không có memoization thủ công nào để làm sai.

**Chi phí/rủi ro thực tế đáng lưu ý:**
- **Dependency này là một bản phát hành beta.** `^19.0.0-beta-e552027-20250112` là một tag prerelease, không phải phiên bản GA (chính thức) của trình biên dịch. Một dải caret (caret range) trên một bản prerelease thực chất chỉ ghim vào đúng chuỗi prerelease đó — việc nâng cấp đòi hỏi phải chủ động chuyển sang một bản beta mới hơn hoặc bản ổn định cuối cùng, và hành vi/bề mặt lỗi của compiler beta vốn dĩ chưa được kiểm chứng nhiều bằng các hook mà nó thay thế.
- **Trình biên dịch là một hộp đen (black box) so với memoization thủ công.** Khi một `useMemo` viết tay không hoạt động như mong đợi, bạn có thể đọc dependency array và suy luận trực tiếp về nó. Khi trình biên dịch không memoize một thứ mà bạn kỳ vọng nó sẽ memoize, cách duy nhất để biết là kiểm tra output đã biên dịch hoặc profile — không có dependency array nào để nhìn lướt qua trong source.
- **Đây là một quy ước all-or-nothing của nhóm, không được công cụ (tooling) thực thi bắt buộc.** Không có gì trong repo này (không có lint rule, không có CI check) thực sự ngăn ai đó thêm lại một `useCallback` thủ công — việc đó chỉ đơn giản là dư thừa so với những gì trình biên dịch đã làm, chứ không gây lỗi. Quy tắc "không memoization thủ công" hiện tại là vấn đề thuộc về kỷ luật của nhóm, không phải một rào chắn kỹ thuật (guardrail).
