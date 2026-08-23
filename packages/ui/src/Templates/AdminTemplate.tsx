import { type FC, ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Tag } from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UserOutlined,
  CalendarOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import Logo from "../Logo/Logo";
import { settings, ACCESS_TOKEN, USER_LOGIN, APP_ROUTES } from "@cinefix/utils";

const { Header: AntHeader, Sider, Content } = Layout;

interface AdminTemplateProps {
  children: ReactNode;
}

const AdminTemplate: FC<AdminTemplateProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userLogin = useSelector((state: any) => state.UserSaga?.userLogin);

  const handleLogout = () => {
    settings.eraseCookie(ACCESS_TOKEN);
    settings.eraseCookie(USER_LOGIN);
    window.location.href = APP_ROUTES.LOGIN;
  };

  const menuItems = [
    {
      key: APP_ROUTES.ADMIN,
      icon: <DashboardOutlined />,
      label: "Dashboard tổng quan",
      onClick: () => navigate(APP_ROUTES.ADMIN),
    },
    {
      key: APP_ROUTES.ADMIN_FILMS,
      icon: <VideoCameraOutlined />,
      label: "Quản lý phim",
      onClick: () => navigate(APP_ROUTES.ADMIN_FILMS),
    },
    {
      key: APP_ROUTES.ADMIN_USERS,
      icon: <UserOutlined />,
      label: "Quản lý người dùng",
      onClick: () => navigate(APP_ROUTES.ADMIN_USERS),
    },
    {
      key: APP_ROUTES.ADMIN_SHOWTIMES,
      icon: <CalendarOutlined />,
      label: "Tạo lịch chiếu",
      onClick: () => navigate(APP_ROUTES.ADMIN_SHOWTIMES),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider width={260} className="bg-surface border-r border-border hidden md:block">
        <div className="p-4 border-b border-border">
          <Link to={APP_ROUTES.HOME}>
            <Logo size="sm" />
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="bg-transparent border-none p-2 space-y-1 font-semibold text-text-primary"
        />
      </Sider>

      <Layout>
        <AntHeader className="bg-surface border-b border-border px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-text-primary hidden sm:block">
              Hệ Thống Quản Trị Cinefix
            </h2>
            <Tag color="gold" className="font-bold">ADMIN PANEL</Tag>
          </div>

          <div className="flex items-center gap-3">
            <Button
              icon={<HomeOutlined />}
              onClick={() => navigate(APP_ROUTES.HOME)}
              className="bg-background border-border text-text-primary text-xs"
            >
              Trang Chủ User
            </Button>

            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar icon={<UserOutlined />} className="bg-primary" />
              <span className="text-xs font-bold text-text-primary hidden sm:inline">
                {userLogin?.hoTen || userLogin?.taiKhoan}
              </span>
              <Button
                type="text"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                title="Đăng xuất"
              />
            </div>
          </div>
        </AntHeader>

        <Content className="p-6 bg-background text-text-primary overflow-y-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminTemplate;
