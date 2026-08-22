import { type FC } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { SEOProps } from "shared/types/seo.types";

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

      {/* Canonical & Hreflang Alternate Links for Multilingual SEO */}
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
