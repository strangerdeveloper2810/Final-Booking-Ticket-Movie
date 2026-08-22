import { type FC } from "react";
import { Skeleton } from "antd";

/**
 * EN: Placeholder shown in place of the hero/banner carousel while its slides are loading, to
 * avoid layout shift and give a loading affordance.
 * VI: Khung giữ chỗ hiển thị thay cho carousel banner chính trong lúc các slide đang tải, giúp
 * tránh lệch layout và cho người dùng biết nội dung đang tải.
 * @returns EN: the skeleton carousel JSX element. VI: phần tử JSX của khung xương carousel.
 */
const SkeletonCarousel: FC = () => {
  return (
    <div className="w-full h-[450px] bg-surface flex items-center justify-center border-b border-border transition-colors">
      <Skeleton.Image active className="!w-full !h-full" />
    </div>
  );
};

export default SkeletonCarousel;
