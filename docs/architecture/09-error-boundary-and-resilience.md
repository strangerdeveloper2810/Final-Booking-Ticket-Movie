# 09. Error Boundaries & Crash Resilience

## Vấn đề mà cơ chế này giải quyết

Theo mặc định, một lỗi JavaScript không được bắt (uncaught) phát sinh trong giai đoạn render của React sẽ unmount **toàn bộ** cây component — một lỗi nhỏ trong một widget bé có thể làm sập cả trang, khiến người dùng nhìn thấy một màn hình trắng mà không có bất kỳ dấu hiệu nào cho biết có gì đó đã sai. Giải pháp của React là mẫu thiết kế "error boundary": một component triển khai `componentDidCatch`/`static getDerivedStateFromError` (đây là một trong số ít API chỉ dành cho class component còn sót lại — vẫn chưa có hooks tương đương cho error boundary trong React tính đến thời điểm viết bài này) để bắt các lỗi phát sinh từ các component con của nó và render một fallback UI thay vì để lỗi lan truyền lên trên.

## Ứng dụng này sử dụng hai lớp, không phải một

```tsx
// src/index.tsx — the outer, global boundary
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
);
```
```tsx
// src/App.tsx — the inner, route-level boundary
const App: FC = (): JSX.Element => (
  <HelmetProvider>
    <CustomThemeProvider>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </CustomThemeProvider>
  </HelmetProvider>
);
```
**Tại sao là hai lớp, không phải một**: boundary bên ngoài trong `index.tsx` bao bọc chính `Provider` của Redux và `BrowserRouter` — nếu một trong hai *thứ đó* không khởi tạo được (cực kỳ hiếm, nhưng không phải là không thể), thì boundary bên ngoài là thứ duy nhất còn có thể bắt được lỗi đó, vì bên dưới nó trong cây thậm chí chưa có gì tồn tại để bắt bất cứ điều gì. Boundary bên trong trong `App.tsx` chỉ bao bọc `AppRoutes` — đây mới là boundary thực sự quan trọng hàng ngày: nếu một lỗi trong, chẳng hạn, phần render của trang `Detail` bị ném ra, boundary này sẽ bắt lỗi đó *mà không* unmount luôn `HelmetProvider`/`CustomThemeProvider`, nghĩa là theme và ngữ cảnh SEO của ứng dụng vẫn tồn tại và một fallback UI được style đúng cách vẫn có thể render, thay vì phải lùi hẳn về giao diện fallback của boundary ngoài cùng. Cấu trúc hai lớp này là một mẫu phòng thủ theo chiều sâu (defense-in-depth) hợp lý và có chủ đích: bắt lỗi càng gần nơi xảy ra sự cố càng tốt trong khả năng có thể, đồng thời có một lớp chặn thô hơn ở phía trên cho bất kỳ điều gì lọt qua được.

## Component này thực sự nằm ở đâu, và tại sao

`ErrorBoundary` nằm trong `src/shared/components/ErrorBoundary/` — xem [doc 06](./06-feature-based-architecture-and-index-barrels.md#shared-vs-features-the-rule-tested-against-real-files) để có phần thảo luận đầy đủ hơn về ranh giới `shared/` so với `features/` nói chung, nhưng lưu ý thẳng thắn dành riêng cho component này: cả hai cách sử dụng hiện tại của nó đều nằm trong các file thuộc composition root của `app` (`index.tsx`, `App.tsx`), chứ không nằm bên trong bất kỳ feature riêng lẻ nào. Hiện tại chưa có feature nào bọc một trong các nhánh cây con rủi ro của riêng nó (ví dụ: cô lập riêng lưới chọn ghế trong `BookingTicket.tsx` để một lỗi render ở đó không làm sập toàn bộ trang đặt vé) trong một instance `ErrorBoundary` của riêng nó. Việc nó nằm trong `shared/` thay vì `app/` đều có thể biện minh được theo cả hai hướng — `shared/` giữ cho cánh cửa luôn mở để một feature có thể trực tiếp sử dụng nó trong tương lai — nhưng cũng đáng nói rõ rằng cách sử dụng thực tế quan sát được hiện nay chỉ giới hạn ở cấp composition root, chứ chưa thực sự mang tính liên-feature (cross-feature).

## File `index.ts` của component này mới là file thực sự xứng đáng tồn tại

Đáng để tham chiếu chéo trực tiếp từ [doc 06](./06-feature-based-architecture-and-index-barrels.md#why-errorboundary-is-the-one-that-works--proof-from-git-history): trong số 11 file barrel (`index.ts`) nằm dưới `src/`, file của `ErrorBoundary` là file **duy nhất** mà mã nguồn thực sự import thông qua nó. Lịch sử git của chính nó cho thấy lý do — component này ban đầu được triển khai trực tiếp bên trong một file tên là `index.tsx`, sau đó được đổi tên thành `ErrorBoundary.tsx` cùng với việc thêm một file barrel `index.ts` mới chỉ một dòng để giữ nguyên đường dẫn import. Cả hai bên tiêu thụ (`index.tsx`, `App.tsx`) đều không cần thay đổi gì qua lần đổi tên đó, chính *vì* chúng luôn import cả thư mục, chứ không phải một tên file cố định — đây là minh chứng rõ ràng nhất, thực tế nhất (không phải giả định) trong codebase này về công dụng thực sự của một barrel file.

## Hướng dẫn thực tiễn

- Nếu bạn đang thêm một phần UI thực sự rủi ro, biệt lập bên trong một feature (chẳng hạn, thứ gì đó render dựa trên dữ liệu API của bên thứ ba khó lường hoặc lồng sâu), hãy cân nhắc bọc riêng nhánh cây con đó trong `<ErrorBoundary>` của chính nó thay vì chỉ dựa vào boundary ở cấp route trong `App.tsx` — bằng cách đó, khi có lỗi xảy ra ở đó, nó sẽ suy giảm nhẹ nhàng (degrade gracefully) ngay tại chỗ thay vì làm trắng toàn bộ trang mà người dùng đang xem.
- Đừng kỳ vọng một error boundary sẽ bắt được mọi thứ: các error boundary của React **không** bắt lỗi trong các event handler, mã async (ví dụ: bên trong một `.then()` hoặc một hàm `async` không được await trong quá trình render), server-side rendering (không áp dụng ở đây — xem [doc 03](./03-ssg-prerendering-multilingual-seo.md)), hay các lỗi phát sinh trong chính component boundary đó. Những trường hợp này cần cơ chế xử lý riêng (một `try`/`catch`, một `.catch()`, hoặc — đối với các saga trong codebase này — các khối `catch` và lệnh gọi `toast.error(...)` hiện có đã được ghi lại trong [doc 04](./04-redux-saga-rtk-query-state-management.md)).
