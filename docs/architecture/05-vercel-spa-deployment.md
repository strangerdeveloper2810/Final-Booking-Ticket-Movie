# 05. Vercel SPA Deployment & Environment Setup Checklist

## 🧠 Lý Thuyết (Theoretical Background)

Các ứng dụng Single-Page Application (SPA) xây dựng bằng Webpack render tất cả các tuyến đường (Routes: `/login`, `/detail/:id`, `/booking/:id`) client-side thông qua `react-router-dom`.

Khi ứng dụng được deploy trên môi trường Serverless như Vercel:
1. **Lỗi HTTP 404 (Not Found):** Khi người dùng truy cập trực tiếp đường dẫn sâu (như `https://site.com/detail/1234`) hoặc nhấn F5 Refresh, Vercel Serverless CDN sẽ tìm kiếm file vật lý `/detail/1234/index.html` trên máy chủ. Vì file này không tồn tại, máy chủ sẽ trả về lỗi HTTP 404.
2. **Asset Caching:** Nếu không cấu hình Header Cache, trình duyệt sẽ liên tục tải lại các file JS/CSS tĩnh mỗi lần mở ứng dụng.
3. **Environment Variables:** Tất cả các biến môi trường có tiền tố `REACT_APP_` sẽ được Webpack `DefinePlugin` thay thế tại thời điểm build (Build Time). Vì vậy các biến môi trường bắt buộc phải được khai báo trên Vercel Dashboard trước khi bấm Deploy.

---

## 🎯 Lý Do Áp Dụng (Engineering Rationale)

- **SPA Rewrites Rule:** Thêm luật điều hướng `rewrites` trong `vercel.json` để chuyển hướng tất cả yêu cầu HTTP từ client về file `index.html`, cho phép `react-router-dom` xử lý điều hướng mượt mà.
- **Immutable Cache Header:** Thiết lập Cache 1 năm (`max-age=31536000, immutable`) cho thư mục `/static/` giúp tối ưu tốc độ tải trang cho người dùng quay lại.

---

## 📋 Checklist Cấu Hình Biến Môi Trường (Vercel Environment Variables)

Vào **Vercel Dashboard ➔ Project Settings ➔ Environment Variables** và điền đầy đủ các cặp Key - Value sau:

| STT | Key | Example Value | Mô tả |
|---|---|---|---|
| 1 | `REACT_APP_DOMAIN` | `https://movienew.cybersoft.edu.vn/api` | Domain API backend Cybersoft |
| 2 | `REACT_APP_TOKEN_CYBERSOFT` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Token xác thực kết nối Cybersoft API |
| 3 | `REACT_APP_GROUP_ID` | `GP01` | Mã nhóm dữ liệu phim rạp |
| 4 | `REACT_APP_TMDB_DOMAIN` | `https://api.themoviedb.org/3` | Domain API của The Movie Database |
| 5 | `REACT_APP_TMDB_API_KEY` | `626eb9e5f6865b22f6c5e5c9ce5a220f` | API Key kết nối TMDB |
| 6 | `REACT_APP_TMDB_TOKEN` | `eyJhbGciOiJIUzI1NiJ9.eyJhdW...` | Read Access Bearer Token của TMDB |

---

## 💻 Mã Nguồn Cấu Hình (Full Code Implementation)

### File Cấu Hình Vercel ([`vercel.json`](file:///Users/mdm/Desktop/Final-Booking-Ticket-Movie/vercel.json))

```json
{
  "version": 2,
  "outputDirectory": "build",
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```
