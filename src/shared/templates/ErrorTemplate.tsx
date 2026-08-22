import React, { FC } from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "shared/constants/routes";

const ErrorTemplate: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#0B0D12] px-4">
      <Result
        status="404"
        title={<span className="text-4xl font-extrabold text-[#F2545B]">404</span>}
        subTitle={
          <span className="text-base text-[#9AA0B4]">
            Rất tiếc, trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </span>
        }
        extra={
          <Button
            type="primary"
            size="large"
            onClick={() => navigate(APP_ROUTES.HOME)}
            className="bg-[#F2545B] hover:bg-[#FF6B72] border-none px-8 font-medium"
          >
            Quay về trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default ErrorTemplate;
