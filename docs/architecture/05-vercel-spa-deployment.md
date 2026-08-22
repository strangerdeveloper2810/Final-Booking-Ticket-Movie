# 05. Deployment SPA lên Vercel & Thiết lập Environment

## Vấn đề cốt lõi của việc hosting SPA

Một SPA được build bằng Webpack render mọi route (`/login`, `/detail/:id`, `/booking/:id`) ở phía client thông qua `react-router-dom`. Trên một static host như Vercel, điều đó tạo ra hai vấn đề kinh điển nếu không được cấu hình để xử lý:

1. **Lỗi 404 khi deep-link / refresh.** Khi một người dùng truy cập trực tiếp `https://site.com/detail/1234`, hoặc refresh trang tại URL đó, static file server của Vercel sẽ đi tìm một file vật lý `detail/1234/index.html` — file này không tồn tại, vì app chỉ bao giờ build ra đúng một `index.html`. Nếu không có rewrite rule, đây sẽ là một lỗi HTTP 404 trước khi React Router kịp có cơ hội chạy.
2. **Không có caching nhận biết content-hash theo mặc định.** Nếu không có cache headers rõ ràng, trình duyệt có thể tải lại (re-fetch) các JS/CSS chunk không thay đổi ở mỗi lần truy cập.

## Giải pháp: `vercel.json`

```json
{
  "version": 2,
  "outputDirectory": "build",
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```
- `rewrites` gửi **mọi** đường dẫn đến `/index.html` (đây không phải là redirect — thanh URL vẫn giữ nguyên đường dẫn gốc), cho phép `react-router-dom` tiếp quản ở phía client sau khi SPA đã load. Đây cũng chính là lý do vì sao bản snapshot SSG được đề cập trong [tài liệu 03](./03-ssg-prerendering-multilingual-seo.md) hiển thị giống hệt nhau trên mọi route đối với một crawler không chạy JS — vì ở đây không có logic phía server nào để phục vụ nội dung khác nhau cho từng đường dẫn.
- `/static/*` nhận một cache header `immutable` với thời hạn một năm, điều này an toàn cụ thể là vì build output ở production của webpack sử dụng tên file có content-hash (`main.[contenthash:8].js`) — mỗi lần deploy mới sẽ tạo ra tên file mới cho bất kỳ thứ gì đã thay đổi, nên không có rủi ro phục vụ nội dung cũ dưới một tên file cũ vẫn còn được cache.
- `installCommand: "pnpm install --no-frozen-lockfile"` — cố tình **không** frozen. Một lượt install với frozen-lockfile (mặc định, và nhìn chung là lựa chọn an toàn hơn cho các build CI có thể tái lập) sẽ thất bại nếu `package.json` và `pnpm-lock.yaml` bị lệch nhau dù chỉ một chút. Dự án này đã từng cần đến flag lỏng hơn này trước đây (xem lỗi "webpack-merge missing from package.json" trước đó trong [tài liệu 02](./02-webpack5-build-optimization.md) — một lượt install với frozen-lockfile lẽ ra đã phát hiện ngay sự sai lệch đó và báo lỗi rõ ràng, điều mà có thể lập luận là sẽ giúp lỗi được phát hiện sớm hơn thay vì muộn hơn; sự đánh đổi ở đây là khả năng phục hồi khi deploy trước những sai lệch nhỏ, đổi lấy một tín hiệu báo lỗi sớm và rõ ràng). `framework: null` báo cho Vercel biết là không cần tự động dò (auto-detect) framework preset (ví dụ: giả định đây là CRA rồi ghi đè build command) — Vercel chỉ nên chạy đúng chính xác những gì đã được chỉ định.

## Danh sách kiểm tra Environment variables

Mọi biến được tham chiếu bởi cấu hình `DefinePlugin` của app ([tài liệu 02](./02-webpack5-build-optimization.md#environment-variables-no-automatic-react_app-scanning)) đều phải được thiết lập trong **Vercel Dashboard → Project Settings → Environment Variables**, nếu không build sẽ âm thầm rơi về (fall back) các giá trị mặc định được hard-code sẵn trong `config/webpack.common.js`:

| Key | Purpose |
|---|---|
| `REACT_APP_DOMAIN` | URL gốc (base URL) của Cybersoft API |
| `REACT_APP_TOKEN_CYBERSOFT` | Token xác thực của Cybersoft (bắt buộc đối với hầu hết các endpoint của Cybersoft) |
| `REACT_APP_GROUP_ID` | Mã group/class dữ liệu của Cybersoft |
| `REACT_APP_TMDB_DOMAIN` | URL gốc (base URL) của TMDB API |
| `REACT_APP_TMDB_API_KEY` | API key của TMDB |
| `REACT_APP_TMDB_TOKEN` | Bearer token quyền đọc (read-access) của TMDB |

Không bao giờ commit giá trị thật cho các biến này — `.env` đã bị Git bỏ qua (git-ignored); `.env.example` là template đã được commit vào repo với các giá trị placeholder mẫu.

## Đích deployment thay thế: Firebase Hosting (legacy)

`firebase.json` cùng với `.firebaserc` cũng có mặt trong repo, được cấu hình để serve cùng một `build/` output với cùng ý tưởng SPA-rewrite (`"rewrites": [{"source": "**", "destination": "/index.html"}]`). Điều này cho thấy app đã từng được deploy lên Firebase Hosting vào một thời điểm nào đó, trước hoặc song song với Vercel. Nó không được nối vào bất kỳ script nào trong `package.json` (không có script `deploy` nào gọi Firebase CLI) — hãy xem đây là một đường deployment kiểu legacy/thủ công, không phải một phần của luồng CI/CD chính, trừ khi bạn có lý do cụ thể để sử dụng nó.

## Những gì Vercel *không* làm ở đây

Cần nói rõ điều này, đối chiếu với [tài liệu 10](./10-typescript-safety-and-cicd-gaps.md): build của Vercel chính xác là `pnpm run build`, tức là `webpack --mode production && node scripts/prerender.js`. Nó không chạy `pnpm typecheck`, không chạy `pnpm test`, và cũng không có pipeline CI riêng biệt nào (không có `.github/workflows`) để chặn (gate) các merge trước khi chúng được đưa vào `maintain`. Một lỗi type hay một test bị hỏng sẽ không chặn được một lượt deploy — chỉ có lỗi ở thời điểm build (build-time failure) (lỗi cú pháp, thiếu module, hành vi ESLint-as-error nếu nó từng được đưa trở lại) mới có thể chặn được.
