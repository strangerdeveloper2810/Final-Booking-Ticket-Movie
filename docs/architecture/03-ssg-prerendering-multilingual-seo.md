# 03. Pre-rendering SSG, SEO & Đa ngôn ngữ (i18n)

## Vị trí thực sự của phần này: CSR, không phải SSR, cũng không phải SSG thực sự

Cần nói rõ điều này ngay từ đầu, vì tên file có chữ "SSG" và điều đó rất dễ khiến người đọc hiểu sai: **đây là một ứng dụng React được render phía client (Client-Side Rendered - CSR).** Không có server nào render theo từng request (đó mới là SSR), và cũng không có việc tạo static theo từng route kèm hydration (đó mới là SSG thực sự, kiểu như Next.js/Gatsby/Astro). Thứ tồn tại thay vào đó chỉ là một script Node tự viết, `scripts/prerender.js`, chạy một lần sau khi `webpack build` hoàn tất và chỉnh sửa trực tiếp `build/index.html` — một "bản chụp SEO" (SEO snapshot) cho đúng một route (trang chủ), bằng đúng một ngôn ngữ (tiếng Việt).

Điều này quan trọng cả về mặt sư phạm lẫn kỹ thuật: phần này là một ví dụ minh họa tốt cho việc *tại sao* các framework SSR/SSG coi hydration và việc tạo theo từng route là những nguyên tố cốt lõi (first-class primitives), bằng cách cho thấy cụ thể bạn nhận được gì khi tự tay xấp xỉ 10% điều đó.

### Ba chiến lược rendering thực sự, để có thêm bối cảnh

| Chiến lược | Thời điểm HTML được tạo ra | Ứng dụng này làm gì |
|---|---|---|
| **CSR** (Client-Side Rendering) | Trong trình duyệt, sau khi JS được tải về và chạy | ✅ Đây chính xác là những gì mọi route trong ứng dụng này thực hiện — `ReactDOM.createRoot(...).render(...)` trong `src/index.tsx`, chấm hết. |
| **SSR** (Server-Side Rendering) | Theo từng HTTP request, trên server, sử dụng dữ liệu của chính request đó | ❌ Không tồn tại. `vercel.json` chỉ là một static-file host thuần túy với một quy tắc rewrite cho SPA — không có server function nào render bất cứ thứ gì theo từng request. |
| **SSG** (Static Site Generation) | Một lần, tại thời điểm build, thường theo từng route, sau đó client sẽ *hydrate* (đối chiếu/reconcile) với markup đã được pre-render đó | ⚠️ Chỉ được xấp xỉ một phần và rất hạn hẹp — xem bên dưới. Các framework SSG thực sự cũng thực hiện hydration; ứng dụng này thì không. |

## `scripts/prerender.js` thực sự làm gì

Chạy như nửa sau của `pnpm build`:
```json
"build": "webpack --mode production && node scripts/prerender.js",
```
Chạy tuần tự, không được tích hợp như một webpack plugin — webpack hoàn tất toàn bộ và ghi ra `build/index.html`, sau đó một tiến trình `node` riêng biệt mở file đó lên và chỉnh sửa nó.

Từng bước một, đây là phiên bản hiện tại (đã được sửa lỗi):

1. **Gọi song song hai API trực tiếp (live)** bằng một wrapper `https.get` thuần — không dùng axios, không dùng fetch:
   ```javascript
   const [cybersoftMovies, tmdbMovies] = await Promise.all([
     fetchData("https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP01", { TokenCybersoft: CYBERSOFT_TOKEN }),
     fetchData("https://api.themoviedb.org/3/trending/movie/day?language=vi-VN", { Authorization: `Bearer ${TMDB_TOKEN}` }),
   ]);
   ```
2. **Chuẩn hóa một cách phòng thủ (defensively) bất kể dữ liệu trả về có hình dạng gì**, vì Cybersoft và TMDB bọc payload của họ theo cách khác nhau (`{content: [...]}` so với `{results: [...]}`):
   ```javascript
   const raw = parsed.content ?? parsed.results ?? parsed ?? [];
   resolve(Array.isArray(raw) ? raw : []);
   ```
   `fetchData` không bao giờ reject — cả lỗi mạng lẫn lỗi parse JSON đều resolve về `[]`, nên một API bên thứ ba không ổn định không bao giờ có thể làm sập build.
3. **Xây dựng hai đoạn HTML fragment** (tối đa 8 phim mỗi đoạn) dưới dạng chuỗi template-literal thuần với inline styles, một section cho Cybersoft ("Phim Đang Chiếu tại Rạp") và một section cho TMDB ("🔥 Phim Thịnh Hành TMDB").
4. **Chèn kết quả bằng cách quét thẻ theo kiểu cân bằng (balanced-tag scan), không dùng regex ngây thơ (naive).** Đây là phiên bản đã sửa của một lỗi có thật từng được đưa vào production trước đó — một phiên bản cũ hơn dùng `/<div id="root">[\s\S]*?<\/div>/` (một regex *lazy*), regex này khớp với thẻ đóng `</div>` *ngắn nhất* có thể, nên chỉ cần markup được chèn vào chứa dù chỉ một `<div>` lồng bên trong của chính nó, việc chạy lại build sẽ chỉ thay thế một phần nội dung trước đó và để sót lại markup cũ phía sau — một lỗi hỏng dữ liệu (corruption) có thật, có thể tái hiện, và từng lọt vào một bản `public/index.html` đã được commit. Cách triển khai hiện tại thay vào đó duyệt qua chuỗi, đếm số thẻ `<div>` mở/đóng để tìm ra thẻ đóng *thực sự khớp*, đồng thời bọc khối được chèn vào của chính nó trong các marker `<!-- SSG_START -->`/`<!-- SSG_END -->` để lần chạy thứ hai có thể tìm và thay thế sạch sẽ đúng phần đã chèn ở lần trước (một đường dẫn tái chèn có tính idempotent) thay vì phải quét lại để tìm root div từ đầu:
   ```javascript
   function injectSSG(html) {
     if (html.includes("<!-- SSG_START -->")) {
       return html.replace(/<!-- SSG_START -->[\s\S]*?<!-- SSG_END -->/, prerenderedBlock);
     }
     const startTag = '<div id="root">';
     const startIdx = html.indexOf(startTag);
     if (startIdx === -1) return html;
     let depth = 0, i = startIdx;
     while (i < html.length) {
       if (html.startsWith("<div", i)) { depth++; i += 4; continue; }
       if (html.startsWith("</div>", i)) {
         depth--;
         if (depth === 0) {
           const endIdx = i + "</div>".length;
           return html.slice(0, startIdx) + prerenderedBlock + html.slice(endIdx);
         }
         i += 6; continue;
       }
       i++;
     }
     return html;
   }
   ```
5. **Chỉ ghi vào `build/index.html`.** Một phiên bản trước đó còn chỉnh sửa cả template `public/index.html` đã được commit vào repo, và đó chính xác là cách template đó bị hỏng với markup lặp lại qua các lần build liên tiếp — bản sửa lỗi ghi rõ điều này trong một comment trong code: *"public/index.html is the Webpack TEMPLATE and must stay clean with an empty #root. Modifying the template causes SSG content to accumulate outside #root on repeat builds."*

## Không có hydration — đây là một bản chụp (snapshot), không phải SSG thực sự

`src/index.tsx` render bằng:
```tsx
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<ErrorBoundary><Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider></ErrorBoundary>);
```
Đây là `createRoot(...).render(...)`, **không phải** `hydrateRoot(...)`. Không có hydration ở bất kỳ đâu trong codebase này. Về mặt thực tế: khi một trình duyệt thật tải trang, React hoàn toàn không cố gắng đối chiếu (reconcile) với DOM đã được pre-render — nó vứt bỏ toàn bộ subtree đã pre-render và thực hiện một lần render phía client "lạnh" (cold) vào cùng node `#root` đó. Không có cảnh báo hydration-mismatch nào vì ngay từ đầu React chưa bao giờ thử diff với bản snapshot. Toàn bộ giá trị của HTML đã pre-render nằm ở: (a) có gì đó để một crawler không chạy JS đọc được, và (b) một khoảnh khắc nội dung hiển thị thoáng qua trước khi bundle JS tải xong đối với người dùng thật — nó không đóng góp gì cho quá trình render runtime thực sự của React.

## Crawler thực sự thấy gì trên các route khác

Vì rewrite của `vercel.json` (`"/(.*)" → "/index.html"`) gửi *mọi* path đến cùng một file static, một crawler truy cập `/detail/123` hay `/booking/456` sẽ nhận được chính xác cùng bản snapshot của **trang chủ** (sai danh sách phim, sai title/description trong `<head>` static, vốn cũng chỉ được ghi một lần cho `/`). Đây không phải là "một vỏ rỗng" (empty shell) cho các route đó — đó thực sự là nội dung *sai*, một vấn đề SEO tinh vi hơn và có thể xem là tệ hơn so với việc chỉ có một trang trắng. Chỉ sau khi JS được thực thi thì SPA mới route đến đúng trang và fetch dữ liệu thật, điều mà một crawler không chạy JS không bao giờ thấy được. Và vì bản snapshot chỉ được tạo một lần cho mỗi lần `pnpm build`, nó có thể trở nên lỗi thời (stale) tùy ý giữa các lần deploy — không có cửa sổ revalidation nào (không có kiểu tái tạo giống ISR), chỉ là bất cứ điều gì đúng vào lần cuối cùng ai đó chạy build.

## SEO metadata: `SEO.tsx` + `react-helmet-async`

`HelmetProvider` bọc (wrap) toàn bộ ứng dụng một lần, gần đầu file `src/App.tsx` (không phải trong `index.tsx`), để mọi instance `<SEO>` được render ở bất kỳ đâu trong cây route đều có thể đẩy dữ liệu vào Helmet context dùng chung:
```tsx
<HelmetProvider>
  <CustomThemeProvider>
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  </CustomThemeProvider>
</HelmetProvider>
```
`src/shared/components/SEO/SEO.tsx` là opt-in theo từng trang — nó phát ra `<title>`, các meta tag description/keywords, đầy đủ Open Graph (`og:type`/`og:url`/`og:title`/`og:description`/`og:image`/`og:locale`), một khối Twitter Card, các link canonical + hreflang, và (tùy chọn) một `<script>` JSON-LD nếu prop `jsonLd` được truyền vào. Hiện chỉ có `Home.tsx` và `Detail.tsx` render `<SEO>` — các route khác sẽ rơi về (fall back) bất cứ thứ gì đã được bake sẵn vào `<head>` static của `public/index.html`.

Có hai loại structured data khác nhau tồn tại, và chúng không được tạo ra theo cùng một cách:
- **JSON-LD `MovieTheater` là 100% static** — được viết tay trực tiếp vào `<head>` của `public/index.html`, không bao giờ bị React/Helmet/prerender script động vào. Nó xuất hiện trên mọi route vì nó là một phần của lớp vỏ HTML dùng chung duy nhất.
- **JSON-LD `Movie`/`ItemList` là dynamic**, được xây dựng bên trong `Home.tsx` và `Detail.tsx` từ dữ liệu API trực tiếp và được truyền vào `<SEO jsonLd={...}>`. Trên `Detail.tsx`, JSON-LD này là `undefined` cho đến khi chi tiết phim fetch xong ở phía client — nghĩa là nó không bao giờ tồn tại ở lần paint đầu tiên và cũng không hề tồn tại trong bất kỳ bản snapshot static nào, vì prerender script không động đến `/detail/:id`. Một giá trị giả (fabricated) đáng lưu ý: `aggregateRating.ratingCount` của schema `Movie` là một literal hardcode `"100"`, không được lấy từ bất kỳ trường API thật nào — một giá trị placeholder có nguy cơ bị Google phạt thật sự nếu Google đối chiếu số lượng rating trong structured data với thực tế.

## hreflang / canonical: trông có vẻ đúng nhưng chưa hẳn

```tsx
<link rel="canonical" href={cleanUrl} />
<link rel="alternate" hrefLang="vi" href={`${cleanUrl}?lng=vi`} />
<link rel="alternate" hrefLang="en" href={`${cleanUrl}?lng=en`} />
<link rel="alternate" hrefLang="x-default" href={cleanUrl} />
```
Hai vấn đề có thật, đáng để biết:
1. **Canonical không thay đổi theo ngôn ngữ** — `cleanUrl` (URL hiện tại đã loại bỏ mọi query string) giống hệt nhau cho cả hai bản alternate hreflang `vi` và `en`. Hướng dẫn của Google kỳ vọng mỗi biến thể ngôn ngữ sẽ canonical về *chính nó*; ở đây cả hai biến thể đều trỏ về cùng một canonical, đây là một ví dụ kinh điển của việc hreflang và canonical mâu thuẫn nhau.
2. **Việc phân biệt ngôn ngữ dựa vào query parameter `?lng=`, chứ không phải một path riêng hay subdomain riêng** — và không có logic phía server nào phục vụ HTML khác nhau theo từng query string (rewrite của Vercel phục vụ cùng một file static bất kể query string là gì). Một crawler không chạy JS sẽ nhận được HTML giống hệt nhau từng byte một dù nó request `?lng=vi` hay `?lng=en`; việc chuyển đổi ngôn ngữ thực sự chỉ diễn ra ở phía client sau khi `i18next-browser-languagedetector` đọc được query param. Các thẻ hreflang hứa hẹn hai tài liệu có thể crawl riêng biệt nhưng trên thực tế chúng không tồn tại như hai resource tách biệt — chính vì lý do này mà việc bản địa hóa (localization) dựa trên query parameter bị chính hướng dẫn quốc tế hóa (internationalization) của Google khuyến cáo không nên dùng.

Đây là một ví dụ trung thực và hữu ích cho mục đích học tập: *hình hài* của một cấu trúc SEO đa ngôn ngữ đúng chuẩn đều có đủ cả (hreflang, canonical, og:locale, Helmet theo từng trang), nhưng cơ chế phân phối bên dưới (chuyển đổi ngôn ngữ chỉ ở phía client, không có output static theo từng ngôn ngữ) lại làm suy giảm lợi ích thực sự trước một crawler thật.

## i18n: `i18next` + `react-i18next` + `i18next-browser-languagedetector`

`src/shared/i18n/index.ts` import tĩnh (statically imports) toàn bộ JSON locale tại thời điểm build (không có lazy/backend loading — mọi bản dịch đều được đóng gói kèm trong JS bundle) và khởi tạo:
```typescript
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });
```
Có bảy namespace tồn tại cho mỗi ngôn ngữ trong số hai ngôn ngữ, nằm dưới `src/shared/locales/{en,vi}/`: `auth`, `booking`, `common`, `detail`, `footer`, `header`, `home` — tất cả đã được xác minh có cùng tập key và có các giá trị dịch thực sự khác biệt (không phải copy-paste), bao gồm cả các placeholder nội suy (interpolation) (`{{movie}}`, `{{cinema}}`, `{{theater}}`) được giữ nguyên ở cả hai ngôn ngữ.

Không có tùy chọn `detection` nào được truyền tường minh cho `LanguageDetector`, nên nó chạy theo mặc định của package đã cài đặt: thứ tự detect là `querystring → cookie → localStorage → sessionStorage → navigator → htmlTag`, với kết quả được cache vào `localStorage['i18nextLng']`. Vì điều này không được cấu hình tường minh trong codebase, một bản nâng cấp phiên bản nhỏ (minor version) của `i18next-browser-languagedetector` có thể âm thầm thay đổi hành vi này — đáng để lưu ý thay vì mặc định cho rằng đây là một lựa chọn có chủ đích và đã được pin (pinned).

## Tóm tắt về routing (chi tiết đầy đủ nằm trong `src/app/routes.tsx` của chính codebase)

API `useRoutes` dựa trên object của `react-router-dom` v7 (không phải JSX `<Routes>`/`<Route>`), với cả năm page component vẫn được lazy-load thông qua `React.lazy` dưới một boundary `<Suspense>` dùng chung — phần thảo luận về SSG ở trên chỉ nói về HTML được phân phối từ server; việc code splitting theo route ở phía client hoàn toàn không bị ảnh hưởng bởi bất kỳ điều gì trong số đó.
