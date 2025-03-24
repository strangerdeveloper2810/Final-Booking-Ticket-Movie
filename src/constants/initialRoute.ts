import { lazy } from 'react'
import { IRoute } from '../types/IRoutes'
import { HomeTemplate } from '../Template'

const routes: IRoute[] = [
    {
        path: '',
        Component: lazy(() => import('../Pages/Home')),
        Layout: HomeTemplate
    },
    {
        path: '/home',
        Component: lazy(() => import('../Pages/Home')),
        Layout: HomeTemplate
    },
    {
        path: '/detail/:id',
        Component: lazy(() => import('../Pages/Details')),
        Layout: HomeTemplate
    },
    {
        path: '/booking/:maLichChieu',
        Component: lazy(() => import('../Pages/BookingTicket')),
        Layout: HomeTemplate
    },
    {
        path: '/login',
        Component: lazy(() => import('../Pages/Login')),
        Layout: HomeTemplate
    },
    {
        path: '/register',
        Component: lazy(() => import('../Pages/Register')),
        Layout: HomeTemplate
    }
]

export default routes