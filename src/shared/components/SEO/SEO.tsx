import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "Cinefix - Đặt Vé Xem Phim Rạp Trực Tuyến",
  description = "Hệ thống đặt vé xem phim chiếu rạp nhanh chóng, uy tín hàng đầu. Chọn ghế đẹp, ưu đãi hấp dẫn tại Cinefix.",
  keywords = "đặt vé xem phim, vé xem phim, lịch chiếu phim, rạp chiếu phim, cinefix",
  image = "/logo512.png",
  url = window.location.href,
  type = "website",
  jsonLd,
}) => {
  const siteTitle = title.includes("Cinefix") ? title : `${title} | Cinefix`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

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
