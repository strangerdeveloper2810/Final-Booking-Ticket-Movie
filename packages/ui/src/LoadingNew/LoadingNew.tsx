import { type FC } from "react";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";

const LoadingNew: FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative flex items-center justify-center">
        <Spin size="large" />
      </div>
      <p className="text-sm font-semibold text-text-secondary animate-pulse whitespace-nowrap tracking-wide">
        {t("loading", { defaultValue: "Đang tải dữ liệu..." })}
      </p>
    </div>
  );
};

export default LoadingNew;
