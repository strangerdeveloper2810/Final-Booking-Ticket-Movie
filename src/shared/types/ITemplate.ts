import { ReactNode } from 'react'

/**
 * EN: Props shape for page-layout templates (e.g. `HomeTemplate`) that simply wrap arbitrary
 * page content with shared chrome like Header/Footer.
 * VI: Kiểu props cho các template bố cục trang (ví dụ `HomeTemplate`) chỉ đơn giản bao nội dung
 * trang bất kỳ bằng phần khung dùng chung như Header/Footer.
 */
interface ITemplate {
    children: ReactNode
}

export type { ITemplate }