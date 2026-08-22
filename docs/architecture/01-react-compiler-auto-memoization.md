# 01. React 19 & React Compiler Auto-Memoization

## 🧠 Lý Thuyết (Theoretical Background)

Trong các phiên bản React truyền thống (React 16 -> React 18), để tránh việc một Component bị re-render không cần thiết khi Component cha thay đổi, các nhà phát triển phải sử dụng các API tối ưu hóa thủ công như:
- `React.memo()` để bọc Component.
- `useCallback()` để ghi nhớ tham chiếu hàm (function references).
- `useMemo()` để ghi nhớ giá trị tính toán tốn kém (expensive computations).

Tuy nhiên, việc ghi nhớ thủ công này có 3 nhược điểm lớn:
1. **Developer Overhead:** Gây tốn thời gian lập trình và làm rối mã nguồn.
2. **Stale Closure Bugs:** Rất dễ gặp lỗi nếu mảng dependencies trong `useCallback`/`useMemo` bị thiếu.
3. **Over-memoization / Memory Pressure:** Tạo ra quá nhiều object ghi nhớ trong bộ nhớ.

Với **React 19** và **React Compiler** (`babel-plugin-react-compiler`), trình biên dịch Babel tự động phân tích luồng dữ liệu (Dataflow Analysis) và tự động chèn logic memoization tại thời điểm build mà không cần nhà phát triển phải viết bất kỳ hàm memoization nào.

---

## 🎯 Lý Do Áp Dụng (Engineering Rationale)

1. **Clean Code Protocol:** Dự án tuân thủ nghiêm ngặt quy tắc không nhập `React.memo`, `useCallback` hay `useMemo`.
2. **Zero Overhead Performance:** Component tự động đạt hiệu năng cao nhất mà mã nguồn hoàn toàn sạch sẽ, dễ đọc và bảo trì.
3. **React 19 Ready:** Đón đầu xu hướng công nghệ mới nhất của Facebook / Meta Open Source.

---

## 💻 Mã Nguồn Cấu Hình (Full Code Implementation)

### 1. Webpack Babel Plugin Setup ([`config/webpack.common.js`](file:///Users/mdm/Desktop/Final-Booking-Ticket-Movie/config/webpack.common.js))

```javascript
// config/webpack.common.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
            plugins: [
              // Kích hoạt React Compiler cho React 19
              ["babel-plugin-react-compiler", { target: "19" }],
            ],
          },
        },
      },
    ],
  },
};
```

### 2. Ví Dụ Mã Nguồn Component ([`src/features/home/components/TMDBMovieSection.tsx`](file:///Users/mdm/Desktop/Final-Booking-Ticket-Movie/src/features/home/components/TMDBMovieSection.tsx))

```tsx
// Không cần import { useCallback, useMemo, memo } from "react";
import { type FC, useState } from "react";
import { Modal, Rate, Tag } from "antd";
import Slider from "react-slick";
import { TMDBMovie } from "shared/services/tmdbApi";
import { formatLocalizedDate } from "shared/utils/common";

interface TMDBMovieSectionProps {
  title: string;
  movies?: TMDBMovie[];
  isLoading: boolean;
  lang: string;
}

const TMDBMovieSection: FC<TMDBMovieSectionProps> = ({
  title,
  movies,
  isLoading,
  lang,
}) => {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);

  // Hàm xử lý sự kiện thuần túy - React Compiler sẽ tự động memoize!
  const handleOpenModal = (movie: TMDBMovie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <section className="my-10">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies?.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleOpenModal(movie)}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg object-cover w-full h-72"
            />
            <h3 className="font-semibold text-white mt-2 truncate">{movie.title}</h3>
            <p className="text-xs text-gray-400">
              {formatLocalizedDate(movie.release_date, lang)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TMDBMovieSection;
```
