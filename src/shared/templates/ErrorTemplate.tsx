import React, { FC } from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "shared/constants/routes";

const ErrorTemplate: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 transition-colors">
      <Result
        status="404"
        title={<span className="text-4xl font-extrabold text-primary">404</span>}
        subTitle={
          <span className="text-base text-text-secondary">
            {t("common:notFound")}
          </span>
        }
        extra={
          <Button
            type="primary"
            size="large"
            onClick={() => navigate(APP_ROUTES.HOME)}
            className="bg-primary hover:bg-primary-hover border-none px-8 font-medium"
          >
            {t("common:backToHome")}
          </Button>
        }
      />
    </div>
  );
};

export default ErrorTemplate;
