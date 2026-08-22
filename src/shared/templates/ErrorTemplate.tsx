import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorTemplate: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Result
        status="404"
        title={<span className="text-4xl font-extrabold text-[#F5F6FA]">404</span>}
        subTitle={<span className="text-[#9AA0B4]">Trang bạn tìm kiếm không tồn tại.</span>}
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/")}
            className="bg-[#F2545B] hover:bg-[#FF6B72]"
          >
            Trở về trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default React.memo(ErrorTemplate);
