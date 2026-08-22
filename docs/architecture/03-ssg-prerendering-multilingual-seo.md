# 03. Static Site Generation (SSG) & Multilingual SEO

## 🧠 Lý Thuyết (Theoretical Background)

Các ứng dụng Single Page Application (SPA) xây dựng bằng React truyền thống thường bị hạn chế lớn về mặt SEO (Search Engine Optimization):
1. **Empty HTML Shell:** Phản hồi HTTP ban đầu chỉ chứa thẻ `<div id="root"></div>` rỗng. Con bọ tìm kiếm (Googlebot, Bingbot, Facebook scraper, Zalo) khi cào dữ liệu tĩnh sẽ không đọc được nội dung tiêu đề, bài viết hay danh sách phim.
2. **Lack of Multilingual Signals:** Không báo hiệu cho Google biết trang web có nhiều phiên bản ngôn ngữ khác nhau (Vietnamese vs English).

Để giải quyết triệt để vấn đề này, dự án kết hợp 2 giải pháp:
- **Build-Time SSG Static Pre-rendering (`scripts/prerender.js`):** Tự động cào dữ liệu phim thật từ API khi build và nhúng thẳng cấu trúc Semantic HTML vào `build/index.html`.
- **Dynamic Multilingual Helmet (`SEO.tsx`):** Cập nhật thuộc tính `htmlAttributes={{ lang: i18n.language }}`, `og:locale`, các liên kết `hreflang` alternate và dữ liệu cấu trúc Schema.org JSON-LD (`Movie`, `MovieTheater`).

---

## 🎯 Lý Do Áp Dụng (Engineering Rationale)

- **Tối Ưu SEO Đa Quốc Gia:** Giúp ứng dụng đạt điểm SEO tuyệt đối trên Lighthouse và được Google xếp hạng cao cho cả từ khóa Tiếng Việt lẫn Tiếng Anh.
- **Thẻ Preview Mạng Xã Hội:** Khi chia sẻ liên kết ứng dụng lên Facebook, Zalo, Twitter, thẻ preview OpenGraph hiển thị ảnh bìa, tiêu đề và mô tả phim chuẩn xác.

---

## 💻 Mã Nguồn Cấu Hình (Full Code Implementation)

### 1. Kịch Bản SSG Pre-rendering ([`scripts/prerender.js`](file:///Users/mdm/Desktop/Final-Booking-Ticket-Movie/scripts/prerender.js))

```javascript
// scripts/prerender.js
const fs = require("fs");
const path = require("path");
const https = require("https");
require("dotenv").config();

const buildIndexPath = path.resolve(__dirname, "../build/index.html");
const CYBERSOFT_TOKEN = process.env.REACT_APP_TOKEN_CYBERSOFT || "";

function fetchData(url, headers = {}) {
  return new Promise((resolve) => {
    https.get(url, { headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.content || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on("error", () => resolve([]));
  });
}

async function prerender() {
  if (!fs.existsSync(buildIndexPath)) return;

  const movies = await fetchData(
    "https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP01",
    { TokenCybersoft: CYBERSOFT_TOKEN }
  );

  const movieCardsHtml = movies.slice(0, 8).map(m => `
    <article style="padding: 1rem; background: #171B26; border-radius: 0.5rem;">
      <h3 style="font-size: 1rem; color: #fff;">${m.tenPhim}</h3>
      <p style="font-size: 0.8125rem; color: #A0A5B5;">${m.moTa || ""}</p>
    </article>
  `).join("");

  const staticMarkup = `<div id="root">
    <main style="max-width: 1280px; margin: 0 auto; padding: 2rem 1rem;">
      <h1>Cinefix — Đặt Vé Xem Phim Rạp Trực Tuyến Hàng Đầu</h1>
      <section>${movieCardsHtml}</section>
    </main>
  </div>`;

  let html = fs.readFileSync(buildIndexPath, "utf8");
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, staticMarkup);
  fs.writeFileSync(buildIndexPath, html, "utf8");
  console.log("🚀 SSG Static Pre-rendering completed!");
}

prerender();
```

### 2. Component SEO Đa Ngôn Ngữ ([`src/shared/components/SEO/SEO.tsx`](file:///Users/mdm/Desktop/Final-Booking-Ticket-Movie/src/shared/components/SEO/SEO.tsx))

```tsx
// src/shared/components/SEO/SEO.tsx
import { type FC } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { SEOProps } from "shared/types/seo.types";

const SEO: FC<SEOProps> = ({ title, description, keywords, image, url = window.location.href, type = "website", jsonLd }) => {
  const { t, i18n } = useTranslation("common");
  const currentLang = i18n.language || "vi";

  const cleanUrl = url.split("?")[0];
  const siteTitle = title ? `${title} | Cinefix` : `${t("appName")} - ${t("appDescription")}`;

  return (
    <Helmet htmlAttributes={{ lang: currentLang }}>
      <title>{siteTitle}</title>
      <meta name="description" content={description || t("appDescription")} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={cleanUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:locale" content={currentLang === "vi" ? "vi_VN" : "en_US"} />
      
      {/* Alternate Hreflang Tags cho Multilingual SEO */}
      <link rel="canonical" href={cleanUrl} />
      <link rel="alternate" hrefLang="vi" href={`${cleanUrl}?lng=vi`} />
      <link rel="alternate" hrefLang="en" href={`${cleanUrl}?lng=en`} />
      <link rel="alternate" hrefLang="x-default" href={cleanUrl} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
```
