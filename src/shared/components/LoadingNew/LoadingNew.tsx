import React, { FC } from "react";
import { Spin } from "antd";

const LoadingNew: FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Spin size="large" tip="Đang tải..." />
  </div>
);

export default LoadingNew;
