import { type FC } from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@cinefix/utils";

const ErrorTemplate: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <Result
        status="404"
        title="404"
        subTitle="Rất tiếc, trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển."
        extra={
          <Button
            type="primary"
            onClick={() => navigate(APP_ROUTES.HOME)}
            className="bg-primary hover:bg-primary-hover border-none font-bold"
          >
            Về Trang Chủ
          </Button>
        }
      />
    </div>
  );
};

export default ErrorTemplate;
