import React, { Suspense, lazy, FC } from "react";
import { useTranslation } from "react-i18next";
import LoadingNew from "shared/components/LoadingNew/LoadingNew";
import SEO from "shared/components/SEO/SEO";

const CarouselHome = lazy(() => import("../components/CarouselHome"));
const Film = lazy(() => import("../components/Film"));
const ListCinema = lazy(() => import("../components/ListCinema"));

const Home: FC = () => {
  const { t } = useTranslation(["home", "common"]);

  return (
    <div className="w-full min-h-screen">
      <SEO
        title={t("home:seoTitle")}
        description={t("home:seoDescription")}
        keywords={t("home:seoKeywords")}
      />
      <Suspense fallback={<LoadingNew />}>
        {/* Full bleed Hero Banner */}
        <CarouselHome />

        {/* Content Shell Container */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 space-y-12">
          <Film />
          <ListCinema />
        </div>
      </Suspense>
    </div>
  );
};

export default Home;
