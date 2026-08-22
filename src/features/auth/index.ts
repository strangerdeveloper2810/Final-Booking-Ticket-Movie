// EN: Public barrel for the `auth` feature — routing/other features should
// import from here rather than reaching into `auth/pages` or
// `auth/components` directly, so internal file moves don't ripple outward.
// VI: Điểm export công khai cho feature `auth` — routing/các feature khác
// nên import từ đây thay vì import trực tiếp vào `auth/pages` hay
// `auth/components`, để việc di chuyển file nội bộ không ảnh hưởng ra ngoài.
export { default as Login } from "./pages/Login";
export { default as Register } from "./pages/Register";
export { default as AuthLayout } from "./components/AuthLayout";
