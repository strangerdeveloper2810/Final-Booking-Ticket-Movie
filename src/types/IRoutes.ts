import { FC, ReactNode, LazyExoticComponent } from 'react'

interface IRoute {
    path: string
    Component: LazyExoticComponent<FC>
    Layout: FC<{ children: ReactNode }>
}

export type { IRoute }
