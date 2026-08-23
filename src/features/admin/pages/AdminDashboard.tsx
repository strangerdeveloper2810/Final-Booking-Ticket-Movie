import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Statistic, Button, Table, Tag } from "antd";
import {
  VideoCameraOutlined,
  UserOutlined,
  CalendarOutlined,
  PlusOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { APP_ROUTES } from "shared/constants/routes";
import { useGetFilmListQuery, useGetUserListQuery, useGetCinemasQuery } from "shared/services/movieApi";
import SEO from "shared/components/SEO/SEO";

/**
 * EN: Admin Dashboard home page — displays stats overview and quick actions.
 * VI: Trang tổng quan Dashboard Admin — hiển thị các chỉ số thống kê và tác vụ nhanh.
 */
const AdminDashboard: FC = () => {
  const navigate = useNavigate();

  const { data: films = [], isLoading: loadingFilms } = useGetFilmListQuery();
  const { data: users = [], isLoading: loadingUsers } = useGetUserListQuery();
  const { data: cinemas = [], isLoading: loadingCinemas } = useGetCinemasQuery();

  const recentFilms = films.slice(0, 5);

  const filmColumns = [
    {
      title: "Mã Phim",
      dataIndex: "maPhim",
      key: "maPhim",
      width: 100,
    },
    {
      title: "Hình Ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      width: 80,
      render: (src: string, record: any) => (
        <img
          src={src}
          alt={record.tenPhim}
          className="w-12 h-16 object-cover rounded shadow"
        />
      ),
    },
    {
      title: "Tên Phim",
      dataIndex: "tenPhim",
      key: "tenPhim",
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Trạng Thái",
      key: "status",
      render: (_: any, record: any) => (
        <div className="flex gap-1">
          {record.dangChieu && <Tag color="green">Đang chiếu</Tag>}
          {record.sapChieu && <Tag color="blue">Sắp chiếu</Tag>}
          {record.hot && <Tag color="red">HOT</Tag>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SEO title="Admin Dashboard — Cinefix" description="Trang tổng quan quản trị Cinefix" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tổng Quan Hệ Thống</h1>
          <p className="text-text-secondary text-sm">
            Chào mừng bạn trở lại trang quản trị Cinefix. Dưới đây là thống kê tình hình hoạt động.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(APP_ROUTES.ADMIN_FILMS)}
          >
            Quản Lý Phim
          </Button>
          <Button
            type="default"
            icon={<CalendarOutlined />}
            onClick={() => navigate(APP_ROUTES.ADMIN_SHOWTIMES)}
          >
            Tạo Lịch Chiếu
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="bg-surface border-border">
            <Statistic
              title="Tổng Số Phim"
              value={films.length}
              loading={loadingFilms}
              prefix={<VideoCameraOutlined className="text-primary mr-2" />}
              valueStyle={{ color: "#F2545B", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="bg-surface border-border">
            <Statistic
              title="Tổng Số Người Dùng"
              value={users.length}
              loading={loadingUsers}
              prefix={<UserOutlined className="text-blue-500 mr-2" />}
              valueStyle={{ color: "#3B82F6", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="bg-surface border-border">
            <Statistic
              title="Hệ Thống Cụm Rạp"
              value={cinemas.length}
              loading={loadingCinemas}
              prefix={<CalendarOutlined className="text-green-500 mr-2" />}
              valueStyle={{ color: "#10B981", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Movies Table */}
      <Card
        title="Danh Sách Phim Mới Nhất"
        extra={
          <Button
            type="link"
            onClick={() => navigate(APP_ROUTES.ADMIN_FILMS)}
            className="flex items-center gap-1"
          >
            Xem Tất Cả <ArrowRightOutlined />
          </Button>
        }
        className="bg-surface border-border"
      >
        <Table
          dataSource={recentFilms}
          columns={filmColumns}
          rowKey="maPhim"
          pagination={false}
          loading={loadingFilms}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
