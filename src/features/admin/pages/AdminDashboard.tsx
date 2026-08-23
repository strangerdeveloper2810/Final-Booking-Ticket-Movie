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
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "shared/constants/routes";
import { useGetFilmListQuery, useGetUserListQuery, useGetCinemasQuery } from "shared/services/movieApi";
import SEO from "shared/components/SEO/SEO";

/**
 * EN: Admin Dashboard home page — displays stats overview and quick actions.
 * VI: Trang tổng quan Dashboard Admin — hiển thị các chỉ số thống kê và tác vụ nhanh.
 */
const AdminDashboard: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["admin", "common"]);

  const { data: films = [], isLoading: loadingFilms } = useGetFilmListQuery();
  const { data: users = [], isLoading: loadingUsers } = useGetUserListQuery();
  const { data: cinemas = [], isLoading: loadingCinemas } = useGetCinemasQuery();

  const recentFilms = films.slice(0, 5);

  const filmColumns = [
    {
      title: t("admin:movieCode"),
      dataIndex: "maPhim",
      key: "maPhim",
      width: 100,
    },
    {
      title: t("admin:poster"),
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
      title: t("admin:movieTitle"),
      dataIndex: "tenPhim",
      key: "tenPhim",
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: t("admin:status"),
      key: "status",
      render: (_: any, record: any) => (
        <div className="flex gap-1">
          {record.dangChieu && <Tag color="green">{t("admin:showing")}</Tag>}
          {record.sapChieu && <Tag color="blue">{t("admin:comingSoon")}</Tag>}
          {record.hot && <Tag color="red">{t("admin:hot")}</Tag>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SEO title={`${t("admin:dashboardTitle")} — Cinefix Admin`} description={t("admin:dashboardSubtitle")} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t("admin:dashboardTitle")}</h1>
          <p className="text-text-secondary text-sm">
            {t("admin:dashboardSubtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(APP_ROUTES.ADMIN_FILMS)}
          >
            {t("admin:manageMovies")}
          </Button>
          <Button
            type="default"
            icon={<CalendarOutlined />}
            onClick={() => navigate(APP_ROUTES.ADMIN_SHOWTIMES)}
          >
            {t("admin:createShowtime")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="bg-surface border-border">
            <Statistic
              title={t("admin:totalMovies")}
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
              title={t("admin:totalUsers")}
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
              title={t("admin:totalCinemas")}
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
        title={t("admin:recentMovies")}
        extra={
          <Button
            type="link"
            onClick={() => navigate(APP_ROUTES.ADMIN_FILMS)}
            className="flex items-center gap-1"
          >
            {t("admin:viewAll")} <ArrowRightOutlined />
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
