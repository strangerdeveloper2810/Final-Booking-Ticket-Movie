import React, { FC } from "react";
import { Skeleton } from "antd";

const SkeletonCarousel: FC = () => {
  return (
    <div className="w-full h-[450px] bg-[#151822] flex items-center justify-center border-b border-[#262B3A]">
      <Skeleton.Image active className="!w-full !h-full" />
    </div>
  );
};

export default SkeletonCarousel;
