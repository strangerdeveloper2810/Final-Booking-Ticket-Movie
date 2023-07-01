import { createProxyMiddleware } from "http-proxy-middleware";

const proxyOptions = {
  target: "http://movieapi.cyberlearn.vn", // Thay thế bằng URL của server API thật của bạn
  changeOrigin: true,
  // Các tùy chọn khác nếu cần thiết
};

const proxy = createProxyMiddleware(proxyOptions);

export default proxy;
