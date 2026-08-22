# 05. Vercel SPA Deployment & Header Caching

## 🧠 Lý Thuyết (Theoretical Background)

Các ứng dụng Single-Page Application (SPA) xây dựng bằng Webpack render tất cả các tuyến đường (Routes: `/login`, `/detail/:id`, `/booking/:id`) client-side thông qua `react-router-dom`.

Khi ứng dụng được deploy trên môi trường Serverless như Vercel:
1. **Lỗi HTTP 404 (Not Found):** Khi người dùng truy cập trực tiếp đường dẫn sâu (như `https://site.com/detail/1234`) hoặc nhấn F5 Refresh, Vercel Serverless CDN sẽ tìm kiếm file vật lý `/detail/1234/index.html` trên máy chủ. Vì file này không tồn tại, máy chủ sẽ trả về lỗi HTTP 404.
2. **Asset Caching:** Nếu không cấu hình Header Cache, trình duyệt sẽ liên tục tải lại các file JS/CSS tĩnh mỗi lần mở ứng dụng.

---

## 🎯 Lý Do Áp Dụng (Engineering Rationale)

- **SPA Rewrites Rule:** Thêm luật điều hướng `rewrites` trong `vercel.json` để chuyển hướng tất cả yêu cầu HTTP từ client về file `index.html`, cho phép `react-router-dom` xử lý điều hướng mượt mà.
- **Immutable Cache Header:** Thiết lập Cache 1 năm (`max-age=31536000, immutable`) cho thư mục `/static/` giúp tối ưu tốc độ tải trang cho người dùng quay lại.

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
