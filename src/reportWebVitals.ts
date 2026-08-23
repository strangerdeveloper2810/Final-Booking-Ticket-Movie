import { Metric } from "web-vitals";

/**
 * EN: Reports Core Web Vitals performance metrics (LCP, INP, CLS, FCP, TTFB)
 * to a custom callback (e.g. console.log in dev or Analytics endpoints).
 * VI: Báo cáo chỉ số hiệu năng Core Web Vitals (LCP, INP, CLS, FCP, TTFB)
 * tới callback tùy chỉnh (vd: console.log khi dev hoặc hệ thống Analytics).
 */
const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    import("web-vitals").then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFCP(onPerfEntry);
      onINP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    }).catch((err) => {
      console.warn("Failed to load web-vitals module", err);
    });
  }
};

export default reportWebVitals;
