# 00. Tổng quan kiến trúc & Bản đồ tài liệu

Đây là điểm khởi đầu để tìm hiểu tài liệu kỹ thuật của Cinefix. Hãy đọc tài liệu này trước tiên — nó cho bạn biết ứng dụng thực sự là gì ở thời điểm hiện tại, mỗi tài liệu khác nằm ở đâu, và cung cấp tình trạng trung thực, đã được kiểm chứng của codebase (bao gồm cả những phần chưa hoàn thiện hoặc không nhất quán). Mọi khẳng định trong bộ tài liệu này đều đã được xác minh bằng cách đọc trực tiếp mã nguồn thực tế trên `maintain`, chứ không phải suy diễn từ ý định ban đầu — ở những chỗ mà phần triển khai khác với kế hoạch ban đầu, điều đó được nêu rõ ràng thay vì bị làm mờ đi. Đây là tài liệu huấn luyện, không phải tài liệu tiếp thị.

## Ứng dụng này là gì

Cinefix là một ứng dụng single-page render phía client (CSR) dùng React 19 để duyệt phim, xem lịch chiếu tại các rạp, và đặt ghế, được xây dựng dựa trên hai backend thực tế:

- **Cybersoft** (`movienew.cybersoft.edu.vn`) — một API đào tạo bằng tiếng Việt cung cấp phim, rạp chiếu, lịch chiếu, sơ đồ ghế, và một luồng xác thực đầy đủ (đăng nhập/đăng ký). Đây là miền sản phẩm thực sự của ứng dụng.
- **TMDB** (The Movie Database) — một REST API công khai của bên thứ ba được gắn thêm vào để mang lại trải nghiệm duyệt phim "thịnh hành / phổ biến / đánh giá cao nhất / sắp chiếu" phong phú hơn trên trang chủ.

Ứng dụng này **không** được render phía server và **không** phải là kết quả xuất ra của một framework SSG thực thụ (xem [03](./03-ssg-prerendering-multilingual-seo.md) để biết chính xác nó thực chất là gì: một bản snapshot HTML tự chế tại thời điểm build, chỉ áp dụng cho một route duy nhất). Ứng dụng được deploy dưới dạng static bundle lên Vercel, với Firebase Hosting được cấu hình như một mục tiêu cũ/thay thế (xem [05](./05-vercel-spa-deployment.md)).

## Bản đồ tài liệu

| Tài liệu | Nội dung | Đọc tài liệu này nếu bạn muốn biết... |
|---|---|---|
| [01. React Compiler](./01-react-compiler-auto-memoization.md) | `babel-plugin-react-compiler`, tại sao không hề có `useMemo`/`useCallback` ở bất kỳ đâu | ...tại sao các component trông "ngây thơ" nhưng vẫn được cho là nhanh |
| [02. Webpack 5 Build](./02-webpack5-build-optimization.md) | Cấu hình webpack đã eject và tự viết tay; pipeline CSS/Babel/TS; biến môi trường; phân tích bundle | ...tại sao đây không còn là CRA nữa, và chính xác một file `.tsx` trở thành một chunk browser có thể tải như thế nào |
| [03. SSG/SEO/i18n](./03-ssg-prerendering-multilingual-seo.md) | `scripts/prerender.js`, `SEO.tsx`, hreflang, i18next | ..."SSG" ở đây thực sự nghĩa là gì (tiết lộ trước: ít hơn nhiều so với cái tên gợi ý) và các giới hạn SEO thực tế của nó |
| [04. Quản lý state](./04-redux-saga-rtk-query-state-management.md) | Redux Saga so với RTK Query, ranh giới thực tế (không lý tưởng hóa), mã chết | ...tại sao có tới ba cách khác nhau để lấy cùng một dữ liệu trong codebase này |
| [05. Triển khai Vercel](./05-vercel-spa-deployment.md) | `vercel.json`, các rewrite cho SPA, checklist biến môi trường | ...cách thực sự để deploy ứng dụng này mà không gặp lỗi 404 khi refresh |
| [06. Kiến trúc feature & barrel](./06-feature-based-architecture-and-index-barrels.md) | `src/features/*` so với `src/shared/` so với `src/app/`, và **tại sao hầu như mọi thư mục đều có một `index.ts`** | ...lý do đằng sau cấu trúc thư mục, và sự thật trung thực về việc quy ước `index.ts` thực sự có tác dụng đến mức nào |
| [07. Design token & theming](./07-design-tokens-and-theming.md) | `tokens.ts`, `ThemeContext.tsx`, `ConfigProvider` của antd, biến CSS của Tailwind CSS | ...cách theming sáng/tối hoạt động, và tại sao kế hoạch "một nguồn token duy nhất" không hoàn toàn sống sót qua quá trình triển khai |
| [08. Forms](./08-forms-react-hook-form-zod.md) | `react-hook-form` + `zod`, mẫu hình `Controller` | ...cách validate form hoạt động hiện nay, và tại sao nó trông khác so với hình dạng cổ điển của `formik` |
| [09. Error boundaries](./09-error-boundary-and-resilience.md) | `ErrorBoundary`, chiến lược hai lớp | ...điều gì xảy ra khi một component throw lỗi, và tại sao có hai boundary chứ không phải một |
| [10. Khoảng trống về TypeScript & CI](./10-typescript-safety-and-cicd-gaps.md) | Babel chỉ strip types so với type-checking thực sự, không có CI | ...một khoảng trống thực sự, trung thực: lỗi type hiện không chặn build hay deploy của bạn |

## Stack công nghệ, một cách chính xác

| Lớp | Công nghệ | Ghi chú |
|---|---|---|
| UI framework | React 19 | Kèm `babel-plugin-react-compiler` (beta) để tự động memoization — xem [01](./01-react-compiler-auto-memoization.md) |
| Routing | `react-router-dom` v7 (object API `useRoutes`) | Code splitting theo route thông qua `React.lazy` |
| State (business logic + side effects) | Redux Toolkit 2 + `redux-saga` | Xác thực, đặt vé (chọn ghế + gửi đơn) — xem [04](./04-redux-saga-rtk-query-state-management.md) |
| State (đọc server-cache) | RTK Query | `movieApi` (đọc từ Cybersoft) + `tmdbApi` (đọc từ TMDB) |
| Forms | `react-hook-form` + `zod` | Xem [08](./08-forms-react-hook-form-zod.md) |
| UI components | Ant Design 5 | Theming thông qua `ConfigProvider` — xem [07](./07-design-tokens-and-theming.md) |
| Styling | Tailwind CSS 3 + một số ít custom property CSS | `darkMode: "class"` |
| i18n | `i18next` + `react-i18next` + `i18next-browser-languagedetector` | EN/VI, mỗi ngôn ngữ 7 namespace — xem [03](./03-ssg-prerendering-multilingual-seo.md) |
| Build | Webpack 5 tự viết tay (`webpack.config.js` + `config/webpack.{common,dev,prod}.js`) | Đã eject khỏi CRA/craco — xem [02](./02-webpack5-build-optimization.md) |
| Type checking | TypeScript 5, nhưng **chỉ thông qua script `pnpm typecheck` chạy thủ công** | Không được tích hợp vào `build` hay bất kỳ CI nào — xem [10](./10-typescript-safety-and-cicd-gaps.md) |
| Testing | Jest + `ts-jest` | 3 bộ test, tổng cộng 7 test (test cho saga generator + một test util) — độ phủ thực tế nhưng hẹp |
| Deployment | Vercel (static) | Cấu hình Firebase Hosting cũng có, nhưng đã lỗi thời — xem [05](./05-vercel-spa-deployment.md) |

## Vị trí của ứng dụng này trên phổ rendering (phiên bản ngắn gọn)

Nếu bạn chỉ nhớ một điều duy nhất từ bộ tài liệu này, hãy nhớ điều này: **đây là một ứng dụng CSR (render phía client)**, chấm hết. Không có server nào render theo từng request (không có SSR), và cũng không có real per-route static generation nào (không có SSG thực thụ). Cái mà nó *thực sự có* là một script Node tự chế duy nhất (`scripts/prerender.js`) chạy một lần sau `webpack build` và chèn (bằng cách nối chuỗi) một bản snapshot HTML dựng tay của các phim "đang chiếu" vào **chỉ duy nhất route trang chủ**, đơn thuần để một crawler không chạy JS có thứ gì đó để đọc. Mọi route khác (`/detail/:id`, `/booking/:id`, `/login`, ...) đều trả về cho crawler không chạy JS chính xác cùng một snapshot trang chủ đó, bởi vì rewrite SPA của Vercel (`vercel.json`) chuyển hướng mọi đường dẫn về cùng một `index.html`. [Tài liệu 03](./03-ssg-prerendering-multilingual-seo.md) trình bày đầy đủ điều này, bao gồm cả lý do tại sao đây là một ví dụ giảng dạy thực sự hữu ích cho việc *vì sao* các framework thực thụ (Next.js, Remix, Astro) xây dựng hydration và per-route generation như những nguyên thủy hạng nhất (first-class primitives) thay vì để các team tự tái tạo lại một cách chắp vá 10% chức năng đó bằng tay.

## Danh sách các vấn đề đã biết, trung thực (tính đến thời điểm viết tài liệu này)

Hai lỗi thực sự đã được phát hiện và sửa trong quá trình thực hiện đợt tài liệu này (cả hai đều đã được merge vào `maintain`):
- `webpack-merge` bị thiếu trong `package.json`, khiến cho **mọi** script chạy bằng webpack (`dev`, `start`, `build`, `build:dev`, `analyze`) — và do đó mọi lần deploy trên Vercel — đều thất bại ngay lập tức. Đã sửa bằng cách bổ sung dependency này.
- Các bản build production đang phát hành một `index.html` chưa được minify (một hồi quy do việc tách cấu hình webpack thành các module common/dev/prod). Đã sửa bằng cách chuyển `HtmlWebpackPlugin` vào các cấu hình riêng theo từng mode, kèm theo khối `minify` thực sự cho production.

Mọi thứ dưới đây **không phải** là lỗi làm hỏng build — đây là nợ kiến trúc thực sự, hiện hữu và đáng để biết đến chứ không phải là lý do để hoảng loạn:
- Một số slice của Redux Saga (`Banner`, `FlimList`, `ListCinema`, `Loading`) được đăng ký trong store và watcher của chúng được fork trong `rootSaga`, nhưng không còn gì dispatch hay đọc chúng nữa — dữ liệu thực tế của trang chủ giờ đây đến từ `movieApi` của RTK Query thay vào đó. Xem [04](./04-redux-saga-rtk-query-state-management.md).
- Trong số 11 file barrel `index.ts` nằm dưới `src/`, chỉ có 1 file (`ErrorBoundary`) thực sự được import thông qua đường dẫn thư mục của nó — số còn lại đều bị bỏ qua bởi mọi consumer thực tế. Xem [06](./06-feature-based-architecture-and-index-barrels.md).
- Design token được định nghĩa ở ba nơi (`shared/theme/tokens.ts`, các biến CSS trong `src/index.css`, và mã hex hardcode trong `tailwind.config.js`) thay vì chỉ một nơi, trái với kế hoạch thiết kế ban đầu. Xem [07](./07-design-tokens-and-theming.md).
- Cấu hình SEO `hreflang`/`canonical` có một sự không nhất quán kỹ thuật thực sự (canonical không thay đổi theo ngôn ngữ trong khi các phương án thay thế hreflang lại khẳng định là có) và việc phân biệt ngôn ngữ dựa vào tham số query `?lng=`, thứ mà hầu hết các crawler sẽ loại bỏ. Xem [03](./03-ssg-prerendering-multilingual-seo.md).
- `tsc --noEmit` không phải là một phần của `build` hay bất kỳ pipeline CI nào (thực tế không hề có pipeline CI nào — không có `.github/workflows`). Xem [10](./10-typescript-safety-and-cicd-gaps.md).

Không có điều nào ở trên được trình bày nhằm mục đích làm ai đó xấu hổ — đây chính xác là dạng trạng thái nửa-chừng-di-chuyển, quy ước-áp-dụng-một-phần mà mọi codebase thực sự, đang được phát triển tích cực đều rơi vào, và việc gọi tên nó một cách chính xác sẽ hữu ích hơn nhiều cho mục đích huấn luyện so với việc giả vờ rằng kiến trúc này sạch sẽ hơn thực tế.
