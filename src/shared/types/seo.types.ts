/**
 * EN: Props accepted by the `SEO` component to override the app-wide default `<head>` metadata
 * on a per-page basis. All fields are optional — omitted ones fall back to i18n defaults inside
 * `SEO.tsx`.
 * VI: Các props mà component `SEO` nhận để ghi đè metadata `<head>` mặc định của toàn app theo
 * từng trang. Mọi trường đều tuỳ chọn — nếu bỏ trống sẽ dùng giá trị mặc định từ i18n bên trong
 * `SEO.tsx`.
 */
export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: object;
}
