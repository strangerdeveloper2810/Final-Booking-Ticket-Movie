import { type FC, useState } from "react";
import { Modal, Skeleton } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { useGetMovieImagesQuery, getTMDBImageUrl } from "shared/services/tmdbApi";

interface MovieGalleryProps {
  tmdbId?: number | string;
}

/**
 * EN: Displays a high-resolution backdrop and poster photo gallery for a movie.
 * VI: Hiển thị bộ sưu tập hình ảnh poster và bối cảnh chất lượng cao cho bộ phim.
 */
const MovieGallery: FC<MovieGalleryProps> = ({ tmdbId }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { data: images, isLoading } = useGetMovieImagesQuery(tmdbId || 0, {
    skip: !tmdbId,
  });

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  const backdrops = images?.backdrops || [];

  if (backdrops.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
        <PictureOutlined className="text-primary" /> Hình Ảnh Phim (Movie Gallery)
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {backdrops.slice(0, 8).map((img: any, idx: number) => {
          const imgUrl = getTMDBImageUrl(img.file_path, "w500");
          const highResUrl = getTMDBImageUrl(img.file_path, "original");

          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl border border-border cursor-pointer aspect-video bg-surface"
              onClick={() => setActiveImage(highResUrl)}
            >
              <img
                src={imgUrl}
                alt="Movie Backdrop"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs">
                🔍 Phóng To
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={!!activeImage}
        footer={null}
        onCancel={() => setActiveImage(null)}
        centered
        width={900}
        bodyStyle={{ padding: 0, backgroundColor: "transparent" }}
      >
        {activeImage && (
          <img
            src={activeImage}
            alt="Full Backdrop"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        )}
      </Modal>
    </div>
  );
};

export default MovieGallery;
