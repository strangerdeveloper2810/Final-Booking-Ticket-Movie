import { type FC } from "react";
import { Card, Skeleton } from "antd";

/**
 * EN: Placeholder card shown in place of a movie/cinema card while its real data is loading,
 * to avoid layout shift and give a loading affordance.
 * VI: Thẻ giữ chỗ hiển thị thay cho thẻ phim/rạp thật trong lúc dữ liệu đang tải, giúp tránh
 * lệch layout (layout shift) và cho người dùng biết nội dung đang tải.
 * @returns EN: the skeleton card JSX element. VI: phần tử JSX của thẻ khung xương.
 */
const SkeletonCard: FC = () => {
  return (
    <Card
      className="bg-surface border-border overflow-hidden transition-colors"
      cover={
        <div className="h-72 bg-surface-hover flex items-center justify-center">
          <Skeleton.Image active className="!w-full !h-full" />
        </div>
      }
    >
      <Skeleton active paragraph={{ rows: 2 }} />
    </Card>
  );
};

export default SkeletonCard;
