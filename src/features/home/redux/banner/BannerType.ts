// EN: Models a single promotional banner as returned by Cybersoft's
// LayDanhSachBanner endpoint (field names are Vietnamese, mirroring the API).
// VI: Mô tả một banner quảng cáo được trả về từ API LayDanhSachBanner của Cybersoft
// (tên trường là tiếng Việt, giữ nguyên theo API).
interface Banner {
  maBanner: number; // EN: banner code (id). VI: mã banner.
  maPhim: number; // EN: film code this banner links to. VI: mã phim mà banner này liên kết tới.
  hinhAnh: string; // EN: banner image URL. VI: đường dẫn hình ảnh banner.
}

export type { Banner };
