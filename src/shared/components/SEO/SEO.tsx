import { type FC } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { SEOProps } from "shared/types/seo.types";

/**
 * EN: Injects per-page `<head>` metadata (title, description, Open Graph, Twitter Card,
 * canonical/hreflang links, optional JSON-LD) via `react-helmet-async`. Falls back to
 * app-wide i18n defaults (`common:appName` / `common:appDescription`) when a page doesn't pass
 * its own title/description/keywords.
 * VI: Chèn metadata `<head>` cho từng trang (title, description, Open Graph, Twitter Card,
 * canonical/hreflang, JSON-LD tuỳ chọn) thông qua `react-helmet-async`. Dùng giá trị mặc định
 * từ i18n toàn ứng dụng (`common:appName` / `common:appDescription`) khi trang không truyền
 * title/description/keywords riêng.
 * @param props - EN: see `SEOProps` for all supported fields. VI: xem `SEOProps` để biết đầy đủ các trường hỗ trợ.
 * @returns EN: a `Helmet` element (renders nothing visible, only updates `<head>`). VI: một phần tử `Helmet` (không hiển thị gì, chỉ cập nhật `<head>`).
 */
const SEO: FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = "https://cinefix-booking.vercel.app/img/cinefix-logo.png",
  url = typeof window !== "undefined" ? window.location.href : "https://cinefix-booking.vercel.app/",
  type = "website",
  jsonLd,
}) => {
  const { t, i18n } = useTranslation("common");

  const currentLang = i18n.language || "vi";
  const defaultTitle = `${t("appName")} - ${t("appDescription")}`;
  const defaultDesc = t("appDescription");
  const defaultKeywords =
    currentLang === "vi"
      ? "cinefix, đặt vé xem phim, rạp chiếu phim, lịch chiếu phim, cgv, bhd, galaxy, lotte"
      : "cinefix, movie booking, cinema theaters, showtimes, movie tickets";

  const finalTitle = title || defaultTitle;
  const siteTitle = finalTitle.includes("Cinefix") ? finalTitle : `${finalTitle} | Cinefix`;

  const cleanUrl = url.split("?")[0];

  return (
    <Helmet htmlAttributes={{ lang: currentLang }}>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Open Graph / Facebook / Zalo */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={cleanUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={currentLang === "vi" ? "vi_VN" : "en_US"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={cleanUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image} />

      {/*
        Canonical & Hreflang Alternate Links for Multilingual SEO
        EN: Known inconsistency — the hreflang alternates claim there's a distinct URL per
        language (`?lng=vi` / `?lng=en`), but `cleanUrl` (used for canonical/og/twitter) is the
        same URL regardless of language, and the app switches language via i18next client-side
        state rather than by reading a `?lng=` query param on load. Search engines following
        these hreflang URLs would land on a page whose displayed language doesn't necessarily
        match. Left as-is here (behavior-preserving refactor) but flagged for a follow-up fix.
        VI: Điểm chưa nhất quán đã biết — các thẻ hreflang khẳng định có URL riêng cho từng ngôn ngữ
        (`?lng=vi` / `?lng=en`), nhưng `cleanUrl` (dùng cho canonical/og/twitter) lại là cùng một URL
        bất kể ngôn ngữ nào, và ứng dụng đổi ngôn ngữ qua state của i18next ở client chứ không đọc
        query param `?lng=` khi tải trang. Nếu công cụ tìm kiếm truy cập các URL hreflang này thì
        ngôn ngữ hiển thị thực tế chưa chắc khớp. Giữ nguyên ở đây (refactor không đổi hành vi)
        nhưng ghi chú lại để sửa sau.
      */}
      <link rel="canonical" href={cleanUrl} />
      <link rel="alternate" hrefLang="vi" href={`${cleanUrl}?lng=vi`} />
      <link rel="alternate" hrefLang="en" href={`${cleanUrl}?lng=en`} />
      <link rel="alternate" hrefLang="x-default" href={cleanUrl} />

      {/* Structured JSON-LD Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
