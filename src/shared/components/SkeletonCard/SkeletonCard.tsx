import React, { FC } from "react";
import { Card, Skeleton } from "antd";

const SkeletonCard: FC = () => {
  return (
    <Card
      className="bg-[#151822] border-[#262B3A] overflow-hidden"
      cover={
        <div className="h-72 bg-[#1D2130] flex items-center justify-center">
          <Skeleton.Image active className="!w-full !h-full" />
        </div>
      }
    >
      <Skeleton active paragraph={{ rows: 2 }} />
    </Card>
  );
};

export default SkeletonCard;
