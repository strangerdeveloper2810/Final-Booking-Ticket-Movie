# 02. Hệ thống Build Webpack 5: Ejection, Pipeline và Hiệu năng

## Tại sao dự án này không còn là Create React App nữa

Lịch sử git của dự án này là một bản ghi đầy đủ, có thể truy vết về quá trình eject dần dần (incremental ejection):

1. **Bắt đầu như một CRA thuần túy** (`react-scripts`) — các commit đầu tiên sử dụng các script chuẩn `start`/`build`/`test`/`eject`.
2. **Chuyển sang CRACO** (`@craco/craco`) để có được khả năng tùy chỉnh webpack một phần mà không cần eject hoàn toàn — đây là bước trung gian phổ biến đối với các team cần *một số* quyền kiểm soát (một loader tùy chỉnh, một alias bổ sung) nhưng chưa muốn tự quản lý toàn bộ config.
3. **Gặp phải trở ngại thực sự với hành vi mặc định (baked-in) của CRA/craco.** Một commit trong repo này (`df0c8b1`) ghi lại chính xác điều đó: *"CRA/craco coi các cảnh báo ESLint là lỗi build khi CI=true, một biến mà Vercel mặc định thiết lập, khiến việc deploy thất bại."* Đây không phải là giả thuyết — nó đã thực sự làm hỏng một lần deploy thật.
4. **Gặp phải rào cản mang tính cấu trúc trong chính craco.** File `craco.config.js` từ trước khi eject (có thể khôi phục từ lịch sử git) cần phải thay thế `babel-loader` nội bộ của CRA bằng `swc-loader`, và phải thực hiện theo cách sau:
   ```javascript
   const oneOfRule = webpackConfig.module.rules.find((rule) =>
     Array.isArray(rule.oneOf)
   ).oneOf;
   for (let rule of oneOfRule) {
     if (rule.loader && rule.loader.includes("babel-loader")) {
       rule.loader = require.resolve("swc-loader");
       rule.options = { /* ... */ };
     }
   }
   ```
   Đây là cách can thiệp sâu vào cấu trúc config webpack nội bộ, không được tài liệu hóa của CRA và thay đổi nó bằng cách đoán mò cấu trúc — một pattern (mẫu hình) mong manh, dễ vỡ ngay khi CRA thay đổi cấu trúc rule nội bộ của nó. Đây là bằng chứng cụ thể, chính xác cho loại giới hạn (ceiling) đã thúc đẩy việc eject hoàn toàn.
5. **Eject hoàn toàn sang một config Webpack 5 được viết tay (hand-rolled)** sử dụng trực tiếp `swc-loader`, với toàn quyền kiểm soát `output`, `optimization`, `HtmlWebpackPlugin`, v.v.
6. **Tách file config đơn lẻ thành `config/webpack.{common,dev,prod}.js` + một entry point `webpack.config.js` nhỏ gọn**, được kết hợp bằng `webpack-merge` — đây là thông lệ chuẩn một khi team đã hoàn toàn tự quản lý config của mình, mặc dù không có commit message nào nêu rõ lý do cụ thể khiến craco cản trở điều này (động cơ của bước này chỉ là *suy luận* từ thông lệ phổ biến, chứ không được xác nhận bởi lịch sử commit).
7. **Thay thế `swc-loader` bằng `babel-loader`** trong cùng commit đã đưa vào `babel-plugin-react-compiler` — tại thời điểm thay đổi này được thực hiện, con đường tích hợp được hỗ trợ tích cực của React Compiler chính là plugin Babel, trong khi chưa có tích hợp SWC nào tương đương về độ trưởng thành được sử dụng phổ biến. Commit message không nêu rõ mối liên hệ nhân quả này, vì vậy hãy xem đây là một suy luận hợp lý, chứ không phải một sự thật đã được ghi chép lại.

## Bốn file config và cách chúng kết hợp với nhau

| File | Vai trò |
|---|---|
| `webpack.config.js` (root) | Entry point được `webpack`/`webpack-cli`/`webpack-dev-server` đọc. Chọn `development` hoặc `production` và merge `common` với file mode tương ứng. |
| `config/webpack.common.js` | Dùng chung cho cả hai mode: entry point, filesystem cache, module resolution, rule loader Babel/React-Compiler, các rule static-asset, `CopyWebpackPlugin`, và lệnh gọi `DefinePlugin` để inject mọi biến môi trường `REACT_APP_*`. |
| `config/webpack.dev.js` | Chỉ dành cho dev: `mode`, `devtool` (source map dễ đọc), tên file `output` không hash, việc inject CSS dựa trên `style-loader` (HMR nhanh), `HtmlWebpackPlugin` (không minify), và `devServer`. |
| `config/webpack.prod.js` | Chỉ dành cho prod: `devtool: false` (không có source map — giúp giảm đáng kể trọng lượng bundle), `output` được content-hash, việc tách CSS dựa trên `MiniCssExtractPlugin`, `HtmlWebpackPlugin` **có** minify, `TerserPlugin`/`CssMinimizerPlugin`, `BundleAnalyzerPlugin`, và toàn bộ khối tối ưu hóa `splitChunks`/`runtimeChunk`. |

```javascript
// webpack.config.js
const { merge } = require("webpack-merge");
const commonConfig = require("./config/webpack.common.js");
const devConfig = require("./config/webpack.dev.js");
const prodConfig = require("./config/webpack.prod.js");

module.exports = (env = {}, argv = {}) => {
  const mode = argv.mode || process.env.NODE_ENV || "development";
  switch (mode) {
    case "development":
      return merge(commonConfig, typeof devConfig === "function" ? devConfig(env, argv) : devConfig);
    case "production":
      return merge(commonConfig, typeof prodConfig === "function" ? prodConfig(env, argv) : prodConfig);
    default:
      throw new Error(`No matching Webpack configuration found for mode: ${mode}`);
  }
};
```

Hàm `merge()` thông thường của `webpack-merge` sẽ **nối (concatenate)** các key có giá trị là mảng (`module.rules`, `plugins`) và deep-merge các key có giá trị là object. Một hệ quả đáng lưu ý: `common.js` và mỗi file mode đều tự đăng ký lệnh gọi `DefinePlugin` *của riêng mình* (common cho các biến `REACT_APP_*`, dev/prod chỉ cho `NODE_ENV`) — kết quả là config sau khi merge có hai instance `DefinePlugin` riêng biệt thay vì một lệnh gọi hợp nhất duy nhất. Cả hai đều hoạt động đúng; chỉ là điều này không dễ nhận ra khi đọc từng file một cách riêng lẻ.

> **Một lỗi thực sự đã được đưa vào production và được sửa như một phần của đợt viết tài liệu này:** `webpack.config.js` yêu cầu (`require`) `webpack-merge`, nhưng nó chưa bao giờ được thêm vào `package.json` — nó chỉ tồn tại như một dependency *transitive* của `webpack-cli` bên trong content-addressable store của pnpm, thứ mà cơ chế strict linking của pnpm không expose ra ở root của project. Mọi script chạy qua webpack (`dev`, `start`, `build`, `build:dev`, `analyze`) đều lập tức thất bại với lỗi `Cannot find module 'webpack-merge'`, và vì `buildCommand` của Vercel là `pnpm run build`, nên **mọi lần deploy trên Vercel đều bị lỗi** cho đến khi vấn đề này được phát hiện và khắc phục bằng cách thêm dependency đó một cách tường minh. Bài học: một lần `pnpm install` chạy thành công trên một máy tình cờ đã resolve sẵn package đó theo kiểu transitive sẽ che giấu loại lỗi này — nó chỉ lộ ra khi cài đặt sạch (clean install) hoặc tái tạo lockfile, và đó chính xác là những gì CI/CD thực hiện.

## Cache trên filesystem

```javascript
// config/webpack.common.js
cache: {
  type: "filesystem",
  buildDependencies: {
    config: [__filename],
  },
},
```
Cơ chế persistent cache tích hợp sẵn của Webpack 5 sẽ serialize module graph đã được biên dịch xuống đĩa giữa các lần chạy. `buildDependencies.config: [__filename]` báo cho webpack biết cần invalidate (vô hiệu hóa) toàn bộ cache nếu chính file config thay đổi — nếu không có điều này, việc chỉnh sửa config webpack sẽ không thể tin cậy được để loại bỏ output cache đã cũ. Kết hợp với `cacheDirectory: true` của riêng `babel-loader`, đây chính là điều mang lại lợi ích về tốc độ cho các lần build lặp lại (đây là một cải thiện thực tế, đã được đo đạc theo benchmark riêng của dự án, tuy nhiên hãy xem bất kỳ con số cụ thể nào kiểu "X giây → Y giây" chỉ là một phép đo tại một thời điểm nhất định, không phải là một cam kết vĩnh viễn — nó phụ thuộc vào máy tính, trạng thái cache, và lượng source code đã thay đổi).

## Tối ưu hóa cho production: minification, splitting, chunking

```javascript
// config/webpack.prod.js — optimization block, in full
optimization: {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
        output: { comments: false },
      },
      extractComments: false,
    }),
    new CssMinimizerPlugin(),
  ],
  splitChunks: {
    chunks: "all",
    maxInitialRequests: 25,
    maxAsyncRequests: 30,
    cacheGroups: {
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
        name: "react-core", priority: 30, chunks: "all",
      },
      antdIcons: {
        test: /[\\/]node_modules[\\/]@ant-design[\\/]icons[\\/]/,
        name: "antd-icons", priority: 25, chunks: "all",
      },
      antd: {
        test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
        name: "antd", priority: 20, chunks: "all",
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors", priority: 10, chunks: "all",
      },
      commons: {
        name: "commons", minChunks: 2, priority: -10, chunks: "initial", reuseExistingChunk: true,
      },
    },
  },
  runtimeChunk: {
    name: (entrypoint) => `runtime-${entrypoint.name}`,
  },
  usedExports: true,
  sideEffects: true,
  concatenateModules: true,
},
```

Lý do tách `react-core`/`antd-icons`/`antd`/`vendors` thành các cache group riêng biệt, có tên rõ ràng, thay vì gộp chung vào một bundle `vendors` lớn: **HTTP caching.** Khi code của riêng app thay đổi, trình duyệt của người dùng vẫn còn `react-core.js`/`antd.js` được cache từ lần truy cập trước (content hash giống hệt, vì các thư viện này không thay đổi) — họ chỉ cần tải lại chunk `main.js` nhỏ. Nếu gộp chung thành một vendor bundle duy nhất, điều đó sẽ buộc phải tải lại toàn bộ mọi third-party dependency ở mỗi lần deploy app, kể cả những dependency không hề thay đổi.

`drop_console`/`drop_debugger` trong các tùy chọn compress của Terser sẽ loại bỏ các statement `console.*`/`debugger` khỏi output production — đây là thông lệ chuẩn, đáng để biết trong trường hợp bạn thắc mắc tại sao một `console.log` bạn vừa thêm vào lại không xuất hiện trong bản build production.

## Pipeline CSS: Tailwind, PostCSS, antd

Chuỗi loader khác nhau tùy theo mode, nhưng cùng dùng chung test `.css`:

```javascript
// config/webpack.dev.js — style-loader for fast HMR, no extraction
{ test: /\.css$/, use: ["style-loader", { loader: "css-loader", options: { sourceMap: true } }, "postcss-loader"] }

// config/webpack.prod.js — MiniCssExtractPlugin for real, cacheable .css files
{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] }
```
Các loader áp dụng theo thứ tự phải sang trái: `postcss-loader` chạy Tailwind + Autoprefixer trước, sau đó `css-loader` resolve `@import`/`url()`, rồi đến cơ chế phân phối riêng theo từng mode (inject một thẻ `<style>` lúc runtime ở dev, hoặc trích xuất ra một file `.css` có hash thực sự ở prod). `postcss.config.js` chỉ đơn giản là:
```javascript
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```
antd v5 chủ yếu được style hóa thông qua CSS-in-JS ở runtime, nhưng file reset cơ bản của nó (`antd/dist/reset.css`) cùng với các stylesheet riêng của `react-toastify`/`slick-carousel` được import trực tiếp trong `src/index.tsx` và đi qua cùng rule `.css` này — không có một đường dẫn "vendor CSS" riêng biệt nào cả.

## Sinh HTML và minification

`HtmlWebpackPlugin` render `public/index.html` như một template và inject các thẻ `<script>`/`<link>` đã được build vào đó. Dự án này **trước đây từng có một regression tại đây** (cũng đã được sửa như một phần của đợt viết tài liệu này): khi config được tách thành các module common/dev/prod, `HtmlWebpackPlugin` vẫn nằm trong `common.js` mà không có tùy chọn `minify` — nghĩa là mọi bản build production đều xuất ra một `index.html` chưa được minify (whitespace, comment chưa được nén, v.v.). Bản sửa lỗi đã di chuyển plugin này vào từng file riêng theo mode, để chỉ instance production mới thiết lập:
```javascript
minify: {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
},
```
Việc này diễn ra *trước khi* `scripts/prerender.js` tác động vào `build/index.html` sau đó (xem [tài liệu 03](./03-ssg-prerendering-multilingual-seo.md)) — logic khớp `<div>` cân bằng (balanced) của riêng script prerender vẫn hoạt động tốt trên HTML đã minify, vì minification chỉ loại bỏ whitespace/comment, chứ không ảnh hưởng đến cấu trúc thẻ mà nó phụ thuộc vào.

## Biến môi trường: không tự động quét `REACT_APP_`

Không giống CRA, thiết lập viết tay (hand-rolled) này **không** tự động expose mọi biến `REACT_APP_*` ra client bundle — mỗi biến đều phải được liệt kê thủ công trong một lệnh gọi `DefinePlugin`:

```javascript
// config/webpack.common.js
new webpack.DefinePlugin({
  "process.env.PUBLIC_URL": JSON.stringify(""),
  "process.env.REACT_APP_DOMAIN": JSON.stringify(process.env.REACT_APP_DOMAIN || "https://movienew.cybersoft.edu.vn/api"),
  "process.env.REACT_APP_TOKEN_CYBERSOFT": JSON.stringify(process.env.REACT_APP_TOKEN_CYBERSOFT || ""),
  "process.env.REACT_APP_GROUP_ID": JSON.stringify(process.env.REACT_APP_GROUP_ID || "GP01"),
  "process.env.REACT_APP_TMDB_DOMAIN": JSON.stringify(process.env.REACT_APP_TMDB_DOMAIN || "https://api.themoviedb.org/3"),
  "process.env.REACT_APP_TMDB_API_KEY": JSON.stringify(process.env.REACT_APP_TMDB_API_KEY || ""),
  "process.env.REACT_APP_TMDB_TOKEN": JSON.stringify(process.env.REACT_APP_TMDB_TOKEN || ""),
}),
```
Mỗi entry là một phép thay thế văn bản (literal text substitution) tại bất kỳ nơi nào `process.env.REACT_APP_X` xuất hiện trong source code của ứng dụng — đây là lý do vì sao mọi nơi sử dụng (`src/shared/constants/appConstants.ts`) đều viết `process.env.REACT_APP_DOMAIN || "..."` như một biểu thức văn bản thuần túy. **Mỗi biến môi trường mới cần được bổ sung tương ứng ở ba nơi**: `.env`/`.env.example`, khối `DefinePlugin` này, và Vercel dashboard — trước đây CRA thực hiện việc này miễn phí bằng cách regex-match bất kỳ key `REACT_APP_` nào tại thời điểm build; thiết lập này đánh đổi sự tiện lợi đó để lấy quyền kiểm soát tường minh.

Cũng cần lưu ý rằng `scripts/prerender.js` gọi `dotenv.config()` một cách độc lập, trong tiến trình Node riêng của chính nó, vì nó chạy *sau khi* webpack hoàn tất, dưới dạng một lệnh gọi `node scripts/prerender.js` thuần túy — nó hoàn toàn không đi qua webpack/Babel/`DefinePlugin`.

## Type-checking không phải là một phần của pipeline này

Đáng để nêu ra ở đây dù nó đã được trình bày đầy đủ trong [tài liệu 10](./10-typescript-safety-and-cicd-gaps.md): `@babel/preset-typescript` chỉ **loại bỏ (strip)** cú pháp TypeScript, nó không kiểm tra kiểu dữ liệu (type). `pnpm typecheck` (`tsc --noEmit`) là một script riêng biệt, được gọi thủ công, không được nối vào `build`. Một lỗi type sẽ không làm build của bạn thất bại hay chặn một lần deploy trên Vercel.

## Phân tích bundle

`pnpm analyze` chạy `webpack --mode production --env ANALYZE=true`. Một chi tiết dễ bị bỏ sót: `BundleAnalyzerPlugin` có mặt trên **mọi** bản build production, chứ không chỉ riêng khi chạy `analyze` — `env.ANALYZE` chỉ chuyển đổi `analyzerMode` giữa `"server"` (chế độ tương tác, tự động mở trình duyệt, được dùng bởi `pnpm analyze`) và `"static"` (âm thầm ghi ra `build/bundle-report.html`, là mặc định cho một lần `pnpm build` thông thường). Nếu bạn từng thắc mắc tại sao `build/bundle-report.html` lại tồn tại sau một bản build bình thường, đó chính là lý do.

## Dev server

```javascript
// config/webpack.dev.js
devServer: {
  port: process.env.PORT || 3000,
  historyApiFallback: true, // client-side routing survives a refresh in dev, mirroring vercel.json's rewrite in prod
  hot: true,
  open: false,
  static: { directory: path.join(__dirname, "../public") },
  client: { overlay: true },
},
```
Không có **cấu hình `devServer.proxy`** nào cả — ứng dụng gọi trực tiếp cả Cybersoft API lẫn TMDB, cross-origin, thông qua các URL tuyệt đối (`axios.create({ baseURL: DOMAIN })` và `fetchBaseQuery({ baseUrl: tmdbBaseUrl })` của RTK Query). Điều này chỉ hoạt động được vì cả hai API bên thứ ba đều đã gửi sẵn các header CORS cho phép (permissive); nếu bạn quen với việc thấy một dev-server proxy được dùng riêng để né tránh CORS, thì dự án này không sử dụng pattern đó.
