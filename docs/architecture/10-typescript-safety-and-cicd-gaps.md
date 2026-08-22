# 10. Cấu hình TypeScript & Khoảng trống Type-Safety/CI

## `tsconfig.json`, đầy đủ, cùng với những gì mỗi tùy chọn thực sự mang lại

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src"
  },
  "include": ["src"]
}
```

| Tùy chọn | Nó làm gì ở đây |
|---|---|
| `strict: true` | Bật toàn bộ gói strict mode (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, v.v. tất cả cùng lúc) — cờ có tác động lớn nhất để bắt các lỗi thực sự (như quên rằng một giá trị có thể là `null`/`undefined`) ở cấp độ type. |
| `noEmit: true` | Trình biên dịch riêng của TypeScript chỉ được dùng để kiểm tra (checking), không bao giờ để phát ra (emit) output `.js` — việc phát ra JS thực tế là công việc của Babel (`@babel/preset-typescript` trong pipeline webpack, xem [tài liệu 02](./02-webpack5-build-optimization.md)). Đây là tùy chọn khiến việc nói rằng "TypeScript ở đây là một linter, không phải một compiler" trở nên chính xác. |
| `isolatedModules: true` | Yêu cầu mọi file có thể được transpile một cách an toàn một cách độc lập, từng file một, mà không cần thông tin type xuyên file (cross-file) để phát ra JS đúng. Đây là **hệ quả trực tiếp** của kiến trúc Babel-strips-types (Babel loại bỏ type): Babel xử lý từng file một và hoàn toàn không biết gì về type của các file khác, vì vậy một số tính năng TS cần kiến thức toàn chương trình (whole-program) để loại bỏ đúng cách (ví dụ: re-export một type mà không dùng `export type`, ở các phiên bản TS cũ hơn) bị cấm hoàn toàn. Nếu bạn từng gặp lỗi liên quan đến `isolatedModules`, nó đang nói với bạn rằng đoạn code bạn viết giả định có một compiler kiểm tra type đang thực hiện việc emit — nhưng ở đây thì không phải vậy. |
| `baseUrl: "src"` | Bật kiểu absolute-import `features/home/...`, `shared/components/...` được dùng xuyên suốt ứng dụng. Xem [tài liệu 06](./06-feature-based-architecture-and-index-barrels.md#how-the-absolute-imports-featureshome-sharedcomponentsheader-actually-resolve) để biết chính xác cách điều này phối hợp (hay đúng hơn là trùng hợp thống nhất) với cấu hình resolution riêng biệt của webpack — không có `paths` map, và cũng không có cơ chế chung nào đảm bảo hai bên luôn đồng bộ. |
| `module: "ESNext"` + `moduleResolution: "node"` | Emit/resolve bằng cú pháp ES module gốc và resolution kiểu Node — phù hợp vì webpack (chứ không phải `tsc`) mới là bên thực sự thực hiện bundling và hiểu ESM một cách gốc (native). |
| `skipLibCheck: true` | Bỏ qua việc type-checking bên trong các file `.d.ts` từ `node_modules` — một giá trị mặc định thực dụng gần như phổ biến; nếu không có nó, chỉ một dependency có type kém cũng có thể tạo ra các lỗi type mà bạn không thể tự sửa. |

## Sự đánh đổi cốt lõi: type-checking không phải là một phần của build

Đây là điều quan trọng nhất cần hiểu về mối quan hệ giữa dự án này với TypeScript, và điều này đáng được nói thẳng không cần rào đón: **`pnpm build` không kiểm tra type.** `@babel/preset-typescript` — thứ thực sự chịu trách nhiệm biến file `.tsx` của bạn thành JS mà trình duyệt có thể chạy — hoạt động bằng cách *loại bỏ* (stripping) cú pháp TypeScript (annotation, interface, type-only import) như một phép biến đổi văn bản/cú pháp thuần túy. Nó không, và về mặt kiến trúc *không thể*, xác minh rằng các type của bạn nhất quán nội bộ; bên trong nó hoàn toàn không có type-checker nào cả. Một file có lỗi type thực sự (ví dụ: truyền một `string` vào nơi cần một `number`) vẫn sẽ compile, bundle, và được đưa lên production y hệt như thể nó đúng.

Việc type-checking thực sự chỉ diễn ra thông qua:
```json
"typecheck": "tsc --noEmit"
```
— một script riêng biệt, được gọi thủ công, và **không** được nối vào `build`, `build:dev`, `dev`, hay `analyze` ở bất kỳ đâu trong `package.json`. Và repository này hoàn toàn không có CI pipeline nào (không có thư mục `.github/workflows`, không có cấu hình CI nào khác) để có thể tự động chạy nó trên mỗi lần push hay PR. Vì `buildCommand` trong `vercel.json` chính xác là `pnpm run build`, nên **các lần deploy trên Vercel cũng không bao giờ type-check code.**

## Tại sao sự đánh đổi này tồn tại, và khi nào nó là lựa chọn đúng đắn

Đây không phải là một sơ suất đáng xấu hổ — đó là một sự đánh đổi có chủ đích, phổ biến đối với các dự án coi trọng tốc độ build: mô hình transpilation theo từng file, song song gần như hoàn hảo (embarrassingly parallel) và có thể cache của Babel nhanh hơn đáng kể so với việc chạy trình biên dịch kiểm tra type riêng của TypeScript (`tsc`) như một phần của mỗi lần build, đặc biệt là khi build gia tăng (incremental). Nhiều thiết lập React production (bao gồm cả dự án này) chấp nhận nguyên tắc "type được kiểm tra bởi editor và bởi một bước thủ công/CI riêng biệt, nhưng không bao giờ chặn một lần build" như sự cân bằng đúng đắn giữa tốc độ và an toàn. **Vấn đề cụ thể ở đây là nửa "bước CI riêng biệt" của thỏa thuận đó chưa tồn tại** — có một script `typecheck`, nhưng không có gì chạy nó tự động cả. Đó mới là khoảng trống thực sự, chứ không phải bản thân kiến trúc Babel-strips-types (kiến trúc này vẫn ổn, và được nhiều codebase lớn trong thực tế sử dụng thành công, ví dụ đây chính xác là mẫu hình mà cả compiler dựa trên SWC của Next.js và dev server dựa trên esbuild của Vite đều mặc định áp dụng).

## Một bằng chứng cụ thể liên quan: một tham chiếu CRA đã lỗi thời mà `tsc` chưa bao giờ phàn nàn

```typescript
// src/react-app-env.d.ts
/// <reference types="react-scripts" />
```
`react-scripts` (gói CRA) hoàn toàn không tồn tại trong `package.json` và `node_modules` — file này là một tàn dư từ trước khi dự án eject (xem [tài liệu 02](./02-webpack5-build-optimization.md#why-this-isnt-create-react-app-anymore)). Trên thực nghiệm, `tsc --noEmit` vẫn thoát ra sạch sẽ (exit cleanly) dù tham chiếu này còn tồn tại (TypeScript coi một tham chiếu triple-slash không thể resolve là một vấn đề không nghiêm trọng (non-fatal) trong cấu hình này, thay vì một lỗi cứng) — vì vậy nó hiện không phá vỡ bất cứ điều gì, nhưng đây là một ví dụ nhỏ, trung thực cho việc "quá trình eject không được rà soát 100% cho mọi tham chiếu còn sót lại," và là một lời nhắc nhở rằng một exit code sạch của `tsc --noEmit` không có nghĩa là *không có gì* lỗi thời, mà chỉ có nghĩa là hiện tại không có gì bị hỏng ở cấp độ type.

## Việc chạy `pnpm typecheck` thường xuyên thực sự sẽ bắt được những gì, một cách cụ thể

Dựa trên phần còn lại của bộ tài liệu này, có một vài loại lỗi thực sự trong chính codebase này mà chỉ một type-checker (không phải Babel, không phải các rule mặc định của ESLint, không phải 7 test hiện có) mới có thể bắt được một cách đáng tin cậy nếu chúng được đưa vào bởi một thay đổi trong tương lai:
- Hình dạng (shape) của `action.payload` trong một saga worker bị trôi (drift) không còn đồng bộ với những gì component dispatch thực sự gửi đi (mẫu string-constant + `dispatch({type, payload})` thô được ghi lại trong [tài liệu 04](./04-redux-saga-rtk-query-state-management.md) không có liên kết ở compile-time nào giữa nơi dispatch và type payload mà saga mong đợi, trừ khi cả hai phía đều được annotate và annotation đó thực sự được kiểm tra).
- Một form type được suy ra (inferred) bởi `zod` (`z.infer<typeof schema>`, [tài liệu 08](./08-forms-react-hook-form-zod.md)) bị trôi khỏi những gì một component thực sự đọc từ `formState.errors` nếu một field bị đổi tên trong schema nhưng không được đổi ở mọi nơi sử dụng nó.
- Các props được truyền vào một component sau một lần refactor mà không còn khớp với prop interface thực tế của component đó (một loại lỗi mà bản thân React sẽ không phàn nàn gì ở runtime, trừ khi prop bị thiếu vô tình được sử dụng theo cách gây ra lỗi throw).

## Khuyến nghị cho codebase này, nói thẳng

Nếu một CI pipeline từng được đưa vào (hiện tại thì chưa có), thì bổ sung có đòn bẩy cao nhất so với công sức bỏ ra là: chạy `pnpm typecheck` (và `pnpm test`) trên mỗi pull request trước khi merge, và cân nhắc việc gate các lần deploy dựa trên nó. Cho đến lúc đó, việc chạy `pnpm typecheck` thủ công trước khi push là điều duy nhất đứng giữa một lỗi type thực sự và production.
