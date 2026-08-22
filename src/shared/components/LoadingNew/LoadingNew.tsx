import { type FC } from "react";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";

/**
 * EN: Full-section loading indicator shown while a lazily-loaded route/component is being
 * fetched (used as the `Suspense` fallback in `app/routes.tsx`).
 * VI: Chỉ báo đang tải cho cả một khu vực, hiển thị trong lúc route/component được lazy-load
 * đang được tải (dùng làm fallback cho `Suspense` trong `app/routes.tsx`).
 * @returns EN: the loading indicator JSX element. VI: phần tử JSX của chỉ báo đang tải.
 */
const LoadingNew: FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative flex items-center justify-center">
        <Spin size="large" />
      </div>
      <p className="text-sm font-semibold text-text-secondary animate-pulse whitespace-nowrap tracking-wide">
        {t("loading")}
      </p>
    </div>
  );
};

export default LoadingNew;
