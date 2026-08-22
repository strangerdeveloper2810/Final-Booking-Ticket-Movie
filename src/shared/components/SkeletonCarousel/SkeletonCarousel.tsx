import { type FC } from "react";
import { Skeleton } from "antd";

const SkeletonCarousel: FC = () => {
  return (
    <div className="w-full h-[450px] bg-surface flex items-center justify-center border-b border-border transition-colors">
      <Skeleton.Image active className="!w-full !h-full" />
    </div>
  );
};

export default SkeletonCarousel;
