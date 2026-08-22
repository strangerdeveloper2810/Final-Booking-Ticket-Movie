import { FC, ReactNode, LazyExoticComponent } from 'react'

/**
 * EN: Shape for a route entry pairing a lazily-loaded page component with a layout wrapper.
 * Appears unused — grep across `src/` finds no imports of `IRoute` anywhere, and the actual
 * route table (`app/routes.tsx`) is typed with react-router's own `RouteObject` instead
 * (page + layout are composed directly as JSX per entry, e.g. `<HomeTemplate><Home /></HomeTemplate>`).
 * Kept for now; safe to delete.
 * VI: Kiểu dữ liệu cho một mục route, ghép một component trang lazy-load với một layout bao ngoài.
 * Có vẻ không còn được dùng — grep toàn bộ `src/` không thấy nơi nào import `IRoute`, và bảng route
 * thực tế (`app/routes.tsx`) dùng kiểu `RouteObject` của react-router thay thế (trang + layout được
 * ghép trực tiếp bằng JSX ở từng mục, ví dụ `<HomeTemplate><Home /></HomeTemplate>`).
 * Tạm thời giữ lại; có thể xoá an toàn.
 */
interface IRoute {
    path: string
    Component: LazyExoticComponent<FC>
    Layout: FC<{ children: ReactNode }>
}

export type { IRoute }
