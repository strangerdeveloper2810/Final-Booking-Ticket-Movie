import { type FC } from "react";
import { Card, Skeleton } from "antd";

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
