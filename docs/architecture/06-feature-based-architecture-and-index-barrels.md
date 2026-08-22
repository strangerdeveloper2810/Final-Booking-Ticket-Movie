# 06. Feature-Based Architecture & Quy ước Barrel `index.ts`

Đây là tài liệu trả lời cho câu hỏi "tại sao hầu như mọi thư mục đều có một `index.ts`?" — được trả lời một cách trung thực, với các con số sử dụng thực tế, chứ không phải câu trả lời lý tưởng hóa kiểu sách giáo khoa. Hãy đọc tài liệu này song song với việc thực sự duyệt qua `src/` trong một trình soạn thảo; cây thư mục bên dưới chính xác là những gì đang có trên đĩa ngày hôm nay.

## Cây thư mục

```
src/
├── app/                    — composition root (see below)
│   ├── routes.tsx
│   ├── store.ts
│   └── rootSaga.ts
├── features/               — one folder per business capability, self-contained
│   ├── home/
│   │   ├── index.ts          (public-API barrel — exports the Home page)
│   │   ├── pages/Home.tsx
│   │   ├── components/       (flat .tsx files: CarouselHome, Film, FilmItem, ListCinema, ListMovie, TMDBMovieSection — NOT folder+index.ts)
│   │   ├── redux/{banner,cinema,filmList}/  (per-slice: constants, reducer, saga, types)
│   │   └── types/home.types.ts
│   ├── film-detail/
│   │   ├── index.ts
│   │   ├── pages/Detail.tsx
│   │   ├── redux/types/{CalendarFilmType,FilmDetail}.ts
│   │   └── services/{FlimDetailService,ManagementMovieService}.ts
│   ├── booking/
│   │   ├── index.ts
│   │   ├── pages/BookingTicket.tsx
│   │   ├── redux/{Booking.saga,BookingTicket.reducer,BookingTicketActionTypes,BookingTicketConstants,BookingTicketType}.ts
│   │   └── services/BookingTicketService.ts
│   └── auth/
│       ├── index.ts
│       ├── pages/{Login,Register}.tsx
│       ├── components/{AuthLayout,AuthShowcase}.tsx  (flat files)
│       ├── redux/{UserConstants,UserSaga.reducer,UserSaga,UserType}.ts, UserSaga.test.ts
│       ├── schemas/auth.schema.ts
│       ├── services/Auth.services.ts
│       └── types/auth.types.ts
└── shared/                 — cross-feature building blocks, no feature-specific logic
    ├── components/          (mostly folder + Component.tsx + index.ts, see below)
    ├── constants/, i18n/, locales/, redux/loading/, services/, templates/, theme/, types/, utils/
```

## Mẫu hình composition root (`src/app/`)

`app/` là nơi duy nhất trong codebase được phép biết về *mọi* feature cùng lúc, và được phép vượt qua public barrel của mỗi feature để chạm vào phần nội bộ của nó (`store.ts` và `rootSaga.ts` đều import trực tiếp các file redux cụ thể của từng feature, chứ không thông qua `features/x/index.ts`, vì các barrel đó chỉ export pages, không export phần nội bộ của redux). `features/*` không bao giờ import từ một thư mục `features/*` khác — đã được xác minh bằng grep toàn diện, **không có** import chéo feature (cross-feature import) nào trong toàn bộ ứng dụng. `home` không biết `auth` tồn tại; `booking` không biết `film-detail` tồn tại.

Điều gì sẽ hỏng nếu, chẳng hạn, `routes.tsx` được chuyển vào bên trong `features/home/`: nó cần import cả năm pages (Home, Detail, BookingTicket, Login, Register) để xây dựng một bảng route dùng chung. Việc chuyển nó vào `home` sẽ buộc `home` phải import từ `auth`, `booking`, và `film-detail` — biến một feature ngang hàng thành một orchestrator trên thực tế mà mọi feature khác đều bị ràng buộc ngầm vào, đồng thời phá vỡ tính chất "bất kỳ feature nào cũng có thể bị xóa mà không đụng đến code của feature khác" hiện đang được duy trì.

## `shared/` so với `features/`: quy tắc, được kiểm chứng bằng các file thực tế

**Quy tắc vẫn đứng vững**: một thứ gì đó thuộc về `shared/` nếu nó thực sự được sử dụng bởi nhiều hơn một feature (hoặc bởi `app/`), hoặc nếu nó là hạ tầng không phụ thuộc feature (feature-agnostic) (khởi tạo i18n, theming, bản thân redux store). Điều này đúng với các shared UI components (`Header`, `Footer`, `LoadingNew`, các component `Skeleton*`, `Star`) — tất cả đều được sử dụng từ ít nhất một feature hoặc từ `app/`.

**Nơi quy tắc trở nên mơ hồ hơn, với bằng chứng thực tế:**
- `shared/redux/loading/Loading.reducer.ts` (một boolean `isLoading` duy nhất) chỉ từng bị *ghi vào (written to)* bởi hai saga bên trong `features/home/` — và không bao giờ được *đọc (read)* bởi bất kỳ `useSelector` nào trong toàn bộ ứng dụng. Nó được đăng ký trong store và được dispatch tới, nhưng không có gì hiển thị nó. Nó nằm trong `shared/` dựa trên giả định rằng một cờ loading toàn cục *có thể* được dùng bởi nhiều feature, chứ không phải vì điều đó đã được chứng minh ở hiện tại — đây là trạng thái chết chỉ-để-ghi (write-only dead state), được xếp vào theo chủ đích chứ không theo cách sử dụng thực tế.
- `shared/types/IRoutes.ts` (một interface `IRoute`) không bao giờ được import ở bất kỳ đâu ngoài chính khai báo của nó — `app/routes.tsx` trên thực tế lại định kiểu (type) cho bảng route của nó bằng `RouteObject` riêng của react-router. Điều này trông giống như một type nháp ban đầu (early-draft) đã bị thay thế nhưng chưa từng bị xóa.
- `shared/types/ITemplate.ts` chỉ có đúng một nơi tiêu thụ (consumer) (`shared/templates/HomeTemplate.tsx`) — không thực sự "shared" theo tiêu chí nhiều-consumer, nhưng được xếp vào `shared/types/` vì quy ước thực tế của team là "các typed interface sống trong `shared/types/`," một quy tắc dựa trên *loại file* nhiều hơn là *nhu cầu chia sẻ thực sự*.
- `ErrorBoundary` sống trong `shared/components/` nhưng cả hai nơi sử dụng thực tế của nó (`App.tsx`, `index.tsx`) đều nằm trong các file composition-root, không nằm bên trong bất kỳ feature nào — hiện không có feature nào bọc sub-tree của chính nó bằng component này. Xem [tài liệu 09](./09-error-boundary-and-resilience.md) để có bức tranh đầy đủ.

**Tóm tắt trung thực**: sự phân tách `shared`/`features` là có thật và được áp dụng tốt đối với *code* đã được chứng minh là tái sử dụng, nhưng đối với *types* và một vài phần liên quan gần đến composition-root, nguyên tắc tổ chức thực tế gần với "loại file này luôn nằm ở đây" hơn là "file cụ thể này đã được chứng minh là cần chia sẻ" — và ít nhất một file (`IRoutes.ts`) hoàn toàn chết (dead), và một slice (`Loading.reducer.ts`) là trạng thái chết chỉ-để-ghi. Việc gọi tên chính xác điều này hữu ích cho mục đích đào tạo hơn là trình bày sự phân tách như thể nó hoàn toàn có nguyên tắc.

## Bây giờ, đến câu hỏi về `index.ts`

Có **13** file `index.ts`/`index.tsx` bên dưới `src/` (không tính điểm vào của ứng dụng `src/index.tsx`). Dưới đây là những gì mỗi file thực sự làm, và — quan trọng hơn — **ai thực sự import thông qua nó** so với ai bỏ qua nó và trực tiếp lấy file cụ thể.

### Các barrel "public API" cấp feature — 4 file, 0 consumer thực sự

```typescript
// src/features/auth/index.ts — representative example
export { default as Login } from "./pages/Login";
export { default as Register } from "./pages/Register";
export { default as AuthLayout } from "./components/AuthLayout";
```
Mỗi file trong số `features/{home,film-detail,booking,auth}/index.ts` đều theo cùng một khuôn mẫu: re-export (các) component page của feature (và, đối với `auth`, thêm một shared component). **Đã grep toàn diện cho `from "features/x"` (và biến thể dấu nháy đơn) trên toàn bộ `src/`: không có kết quả khớp nào, cho cả bốn feature.** Mọi consumer thực sự đều trực tiếp lấy file cụ thể thay vào đó:
```typescript
// src/app/routes.tsx — actual usage
const Login = lazy(() => import("features/auth/pages/Login"));
```
Đây không phải là sự bất cẩn — mà là điều bắt buộc về mặt cơ chế kỹ thuật. `React.lazy(() => import(...))` cần một dynamic import mà specifier của nó phân giải (resolve) chính xác đến module bạn muốn, trong chunk riêng của nó. Nếu `routes.tsx` import `{ Login, Register }` từ barrel `features/auth` thay vào đó, nó sẽ kéo theo cả `Login.tsx`, `Register.tsx`, *và* `AuthLayout.tsx` vào chung một node trong module graph — phá vỡ hoàn toàn việc code splitting theo từng route. Đây là một ví dụ thực tế, cụ thể của lưu ý kinh điển "barrel file có thể gây hại cho code-splitting," không phải là một tình huống giả định.

### Các barrel cấp component — 7 file, 1 file thực sự được dùng

| Thư mục | Barrel có được dùng không? |
|---|---|
| `shared/components/ErrorBoundary/` | **Có** — cả hai consumer (`App.tsx`, `index.tsx`) đều import `from "shared/components/ErrorBoundary"` |
| `shared/components/Footer/` | Không — consumer import trực tiếp `from "shared/components/Footer/Footer"` |
| `shared/components/Header/` | Không — cùng khuôn mẫu |
| `shared/components/LoadingNew/` | Không — cả 3 consumer đều import file cụ thể |
| `shared/components/SkeletonCard/` | Không |
| `shared/components/SkeletonCarousel/` | Không |
| `shared/components/Star/` | Không |

**1 trong tổng số 11 barrel re-export (4 cấp feature + 7 cấp component) từng thực sự được import thông qua đường dẫn thư mục của nó.** Mọi câu lệnh import thực tế trong codebase này, ngoại trừ một trường hợp duy nhất, đều chỉ rõ file cụ thể.

### Tại sao `ErrorBoundary` là trường hợp hoạt động hiệu quả — bằng chứng từ lịch sử git

Đây không phải là một phỏng đoán — chính lịch sử commit của repo cho thấy điều này đã xảy ra:
- Một commit đã tạo ra `shared/components/ErrorBoundary/index.tsx` (chính component đó, 198 dòng, được triển khai trực tiếp bên trong một file có tên đúng nghĩa là `index.tsx`).
- Commit ngay sau đó đã đổi tên nó: `index.tsx` → `ErrorBoundary.tsx`, và thêm một `index.ts` một dòng: `export { default } from "./ErrorBoundary";`.

Cả hai consumer của `ErrorBoundary` (`App.tsx`, `index.tsx`) đều **không cần thay đổi gì** qua lần đổi tên đó, vì chúng luôn import thư mục (`shared/components/ErrorBoundary`), chứ không phải một tên file cụ thể bên trong nó. Đó chính là lợi ích thực sự, đã được chứng minh, của mẫu hình barrel, được ghi lại trong chính lịch sử của repo này — và đây gần như chắc chắn cũng là *lý do* vì sao cùng một khuôn mẫu `folder/Component.tsx + index.ts` đã được sao chép một cách máy móc sang mọi thư mục `shared/components/*` khác sau đó, bất kể những thư mục đó có từng được đổi tên hay có cần lớp cách ly (insulation) đó hay không.

### Kết luận trung thực

*Ý tưởng* đằng sau các barrel này là hợp lý — nó ánh xạ đúng vào một ranh giới module thực sự được tôn trọng (không tìm thấy import chéo feature nào; không có gì bên ngoài `app/` chạm vào phần nội bộ redux của một feature). Nhưng *việc thực thi* thì gần như hoàn toàn mang tính hình thức: 10 trong 11 barrel chưa từng được ai import, và hai lý do rõ ràng nhất khiến chúng bị bỏ qua đều mang tính cơ chế kỹ thuật, không phải phong cách (lazy-loading cần một module lá cụ thể; composition root cần phần nội bộ mà không barrel nào phơi bày ra). Bài học cho công việc tương lai trong codebase này: **một barrel file là hạ tầng mang tính kỳ vọng, chỉ thực sự đáng giá khi có thứ gì đó thực sự import thông qua nó.** Việc thêm một barrel "vì đó là pattern ở đây" mà không có tình huống thực sự cần che giấu nội bộ nhiều file là thuần túy hình thức. Thậm chí có hai thư mục phá vỡ hẳn nửa quy ước shared-components — `shared/components/Logo/Logo.tsx` và `shared/components/SEO/SEO.tsx` là các file phẳng (flat file) không hề có `index.ts`, và dường như không có gì bị hỏng vì điều đó.

### Một rủi ro tiềm ẩn có thật, đáng được nêu tên

`package.json` không có trường `"sideEffects"`. Điều này có nghĩa là bản build production của webpack không thể an toàn giả định rằng bất kỳ module nào của chính dự án này — kể cả một barrel làm việc `export { default as Home } from "./pages/Home"` — là không có side-effect ở cấp ranh giới package, điều này quan trọng đối với tree-shaking mạnh mẽ (aggressive). Hiện tại điều này không tốn kém gì trong thực tế, chính xác là vì các barrel không bao giờ được import (dead code không bao giờ được với tới từ một entry point thì không bao giờ bị bundle, chấm hết) — nhưng nếu ai đó bắt đầu sử dụng các feature barrel đúng như mục đích ban đầu mà không thêm khai báo `sideEffects`, sẽ có một vấn đề thực sự về kích thước bundle chưa được đo lường đang chờ đợi.

## Cách các absolute import (`"features/home/..."`, `"shared/components/Header"`) thực sự được phân giải (resolve)

Hai cơ chế độc lập, không được phối hợp với nhau, tình cờ lại nhất quán với nhau — điều này đáng để hiểu chính xác thay vì giả định rằng có một cấu hình alias dùng chung:

- **Phía TypeScript**: `tsconfig.json` đặt `baseUrl: "src"` và **hoàn toàn không có map `paths`**. Với `moduleResolution: "node"` thuần túy + `baseUrl`, TypeScript sẽ thử `<baseUrl>/<specifier>` cho bất kỳ import không tương đối (non-relative) nào — đó là toàn bộ cơ chế mà `tsc --noEmit` dùng để chấp nhận `features/home/pages/Home`.
- **Phía Webpack**: **không có `tsconfig-paths-webpack-plugin`** (đã xác nhận vắng mặt trong cả `package.json` lẫn `node_modules`). Thay vào đó, `config/webpack.common.js` thực hiện:
  ```javascript
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    modules: [path.resolve(__dirname, "../src"), "node_modules"],
    alias: { src: path.resolve(__dirname, "../src") },
  },
  ```
  `resolve.modules` báo cho webpack coi `src/` như **một root khác để tìm kiếm các bare specifier, hệt như `node_modules`.** Khi webpack thấy `import Home from "features/home/pages/Home"`, nó thử `node_modules/features/...` (thất bại), rồi rơi về `src/features/...` (thành công) — vì `src` đã được thêm vào đầu danh sách search-root. Cách này thô hơn so với một path-alias plugin thực thụ: nó chỉ thêm một search root phụ chứ không ánh xạ các alias có tên riêng.

**Hai cơ chế này chỉ nhất quán với nhau vì `baseUrl: "src"` và `resolve.modules: [".../src", ...]` tình cờ trỏ đến cùng một thư mục vật lý** — không có một nguồn sự thật (source of truth) chung nào ép buộc điều đó. Nếu sau này ai đó thêm một mục `paths` vào `tsconfig.json` (ví dụ `"@features/*": ["features/*"]`) mà không có thay đổi tương ứng ở webpack, TypeScript sẽ chấp nhận nó bình thường trong khi webpack sẽ không thể bundle được nó. Đáng để biết nếu bạn từng tự hỏi vì sao một import "type-check qua được nhưng không build được," hoặc ngược lại.

## Quy ước component-folder, một cách chính xác

Khuôn mẫu `folder + Component.tsx + index.ts` **không được áp dụng một cách phổ quát** — chỉ áp dụng cho phần lớn `shared/components/*`. Mọi component và page *bên trong* một feature (`features/*/components/*.tsx`, `features/*/pages/*.tsx`) đều là file phẳng (flat file), không có thư mục và không có barrel — không file nào trong số đó có `index.ts` riêng. Vì vậy, quy tắc thực tế, đúng như đang được tuân theo: *các UI atom `shared/` có thể tái sử dụng, độc lập thì có folder + barrel; các component và page nội bộ của feature, dù nhiều đến đâu, vẫn ở dạng phẳng.* `Logo` và `SEO` là những ngoại lệ không có lời giải thích, thậm chí đối với nửa quy tắc đó.
