import { type FC, ReactNode, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Dropdown, Space, Tag } from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UserOutlined,
  CalendarOutlined,
  HomeOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { RootState } from "app/store";
import { APP_ROUTES } from "shared/constants/routes";
import { useTheme } from "shared/theme/ThemeContext";

const { Header, Sider, Content } = Layout;

interface AdminTemplateProps {
  children: ReactNode;
}

/**
 * EN: Layout template for the Admin Management site — renders a collapsible
 * AntD Sider with navigation links, a themed header with user avatar and site-switch action,
 * and the main content viewport.
 * VI: Template bố cục cho trang Quản trị Admin — hiển thị Sider thu gọn của AntD
 * chứa các link điều hướng, Header theo theme với avatar người dùng và nút chuyển trang,
 * cùng khu vực hiển thị nội dung chính.
 */
const AdminTemplate: FC<AdminTemplateProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userLogin } = useSelector((state: RootState) => state.UserSaga);
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === "dark";
  const { i18n } = useTranslation();

  const menuItems = [
    {
      key: APP_ROUTES.ADMIN,
      icon: <DashboardOutlined />,
      label: "Tổng Quan",
    },
    {
      key: APP_ROUTES.ADMIN_FILMS,
      icon: <VideoCameraOutlined />,
      label: "Quản Lý Phim",
    },
    {
      key: APP_ROUTES.ADMIN_USERS,
      icon: <UserOutlined />,
      label: "Quản Lý Người Dùng",
    },
    {
      key: APP_ROUTES.ADMIN_SHOWTIMES,
      icon: <CalendarOutlined />,
      label: "Tạo Lịch Chiếu",
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  const handleLanguageToggle = () => {
    const nextLang = i18n.language.startsWith("vi") ? "en" : "vi";
    i18n.changeLanguage(nextLang);
  };

  const userMenuItems = [
    {
      key: "client",
      icon: <HomeOutlined />,
      label: "Về Trang Chủ Client",
      onClick: () => navigate(APP_ROUTES.HOME),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={isDark ? "dark" : "light"}
        className="border-r border-border sticky top-0 h-screen overflow-y-auto"
        width={240}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(APP_ROUTES.ADMIN)}
          >
            <span className="text-xl">🎬</span>
            {!collapsed && (
              <span className="font-extrabold text-lg text-primary tracking-wide">
                Cinefix Admin
              </span>
            )}
          </div>
        </div>
        <Menu
          theme={isDark ? "dark" : "light"}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="mt-2 border-none"
        />
      </Sider>

      <Layout className="bg-background">
        <Header className="bg-surface border-b border-border px-4 flex items-center justify-between sticky top-0 z-10 transition-colors h-16">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-text-primary hover:text-primary"
            />
            <span className="font-semibold text-text-primary hidden sm:inline">
              Trang Quản Trị Hệ Thống
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="dashed"
              size="small"
              onClick={handleLanguageToggle}
              className="font-bold text-xs uppercase"
            >
              🌐 {i18n.language.substring(0, 2)}
            </Button>

            <Button
              type="text"
              icon={isDark ? <SunOutlined className="text-secondary" /> : <MoonOutlined className="text-text-primary" />}
              onClick={toggleTheme}
            />

            <Button
              type="default"
              icon={<HomeOutlined />}
              onClick={() => navigate(APP_ROUTES.HOME)}
              className="hidden md:flex items-center gap-1 text-sm font-medium"
            >
              Về Website
            </Button>

            {userLogin && (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space className="cursor-pointer">
                  <Avatar icon={<UserOutlined />} className="bg-primary" />
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="font-semibold text-text-primary text-sm">
                      {userLogin.hoTen || userLogin.taiKhoan}
                    </span>
                    <Tag color="red" className="text-[10px] w-fit mt-0.5 font-bold">
                      {userLogin.maLoaiNguoiDung}
                    </Tag>
                  </div>
                </Space>
              </Dropdown>
            )}
          </div>
        </Header>

        <Content className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl w-full mx-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminTemplate;
