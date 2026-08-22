import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { SEOProps } from "shared/types/seo.types";

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = "/logo512.png",
  url = window.location.href,
  type = "website",
  jsonLd,
}) => {
  const { t } = useTranslation("common");

  const defaultTitle = `${t("appName")} - ${t("appDescription")}`;
  const defaultDesc = t("appDescription");
  const defaultKeywords = "cinefix, movie booking, cinema, tickets, dat ve xem phim";

  const finalTitle = title || defaultTitle;
  const siteTitle = finalTitle.includes("Cinefix") ? finalTitle : `${finalTitle} | Cinefix`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
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
