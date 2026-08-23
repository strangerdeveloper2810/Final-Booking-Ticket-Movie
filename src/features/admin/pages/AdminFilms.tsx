import { type FC, useState } from "react";
import { Table, Button, Input, Card, Tag, Space, Popconfirm, App, Tooltip } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useGetFilmListQuery, useDeleteFilmMutation } from "@cinefix/api-client";
import FilmModal from "../components/FilmModal";
import CreateShowtimeModal from "../components/CreateShowtimeModal";
import { SEO } from "@cinefix/ui";

/**
 * EN: Admin Film Management page — search, add, edit, delete movies, and create showtimes.
 * VI: Trang Quản lý Phim dành cho Admin — tìm kiếm, thêm, sửa, xóa phim và tạo lịch chiếu.
 */
const AdminFilms: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilmModalOpen, setIsFilmModalOpen] = useState<boolean>(false);
  const [editingFilm, setEditingFilm] = useState<any | null>(null);

  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState<boolean>(false);
  const [selectedFilmForShowtime, setSelectedFilmForShowtime] = useState<any | null>(null);

  const { message } = App.useApp();
  const { t } = useTranslation(["admin", "common"]);
  const { data: films = [], isLoading, refetch } = useGetFilmListQuery();
  const [deleteFilm, { isLoading: isDeleting }] = useDeleteFilmMutation();

  const filteredFilms = films.filter((film: any) =>
    film.tenPhim?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingFilm(null);
    setIsFilmModalOpen(true);
  };

  const handleOpenEditModal = (film: any) => {
    setEditingFilm(film);
    setIsFilmModalOpen(true);
  };

  const handleOpenShowtimeModal = (film: any) => {
    setSelectedFilmForShowtime(film);
    setIsShowtimeModalOpen(true);
  };

  const handleDeleteFilm = async (maPhim: number) => {
    try {
      await deleteFilm(maPhim).unwrap();
      message.success(t("admin:deleteSuccess"));
      refetch();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Error deleting film");
    }
  };

  const columns = [
    {
      title: t("admin:movieCode"),
      dataIndex: "maPhim",
      key: "maPhim",
      width: 90,
      sorter: (a: any, b: any) => a.maPhim - b.maPhim,
    },
    {
      title: t("admin:poster"),
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      width: 90,
      render: (src: string, record: any) => (
        <img
          src={src}
          alt={record.tenPhim}
          className="w-12 h-16 object-cover rounded shadow border border-border"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/200/300";
          }}
        />
      ),
    },
    {
      title: t("admin:movieTitle"),
      dataIndex: "tenPhim",
      key: "tenPhim",
      render: (text: string) => <span className="font-bold text-text-primary">{text}</span>,
    },
    {
      title: t("admin:description"),
      dataIndex: "moTa",
      key: "moTa",
      ellipsis: true,
      width: 250,
    },
    {
      title: t("admin:status"),
      key: "status",
      width: 180,
      render: (_: any, record: any) => (
        <div className="flex flex-wrap gap-1">
          {record.dangChieu && <Tag color="green">{t("admin:showing")}</Tag>}
          {record.sapChieu && <Tag color="blue">{t("admin:comingSoon")}</Tag>}
          {record.hot && <Tag color="red">{t("admin:hot")}</Tag>}
        </div>
      ),
    },
    {
      title: t("admin:rating"),
      dataIndex: "danhGia",
      key: "danhGia",
      width: 100,
      render: (score: number) => (
        <Tag color="orange" className="font-bold">
          ⭐ {score}/10
        </Tag>
      ),
    },
    {
      title: t("admin:actions"),
      key: "actions",
      width: 160,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title={t("admin:createShowtime")}>
            <Button
              type="primary"
              ghost
              size="small"
              icon={<CalendarOutlined />}
              onClick={() => handleOpenShowtimeModal(record)}
            />
          </Tooltip>
          <Tooltip title={t("admin:editMovie")}>
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
            />
          </Tooltip>
          <Tooltip title={t("admin:deleteMovie")}>
            <Popconfirm
              title={t("admin:deleteMovie")}
              description={t("admin:confirmDeleteMovie", { title: record.tenPhim })}
              onConfirm={() => handleDeleteFilm(record.maPhim)}
              okText={t("admin:deleteMovie")}
              cancelText={t("admin:cancel")}
              okButtonProps={{ danger: true, loading: isDeleting }}
            >
              <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SEO title={`${t("admin:filmListTitle")} — Cinefix Admin`} description={t("admin:filmListSubtitle")} />

      <Card className="bg-surface border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">{t("admin:filmListTitle")}</h1>
            <p className="text-text-secondary text-sm">
              {t("admin:filmListSubtitle")}
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAddModal}
            className="bg-primary hover:bg-primary-hover font-semibold border-none"
          >
            {t("admin:addMovie")}
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder={t("admin:searchFilmPlaceholder")}
            prefix={<SearchOutlined className="text-text-secondary" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            size="large"
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredFilms}
          rowKey="maPhim"
          loading={isLoading}
          pagination={{ pageSize: 8, showSizeChanger: true }}
          scroll={{ x: 800 }}
        />
      </Card>

      <FilmModal
        open={isFilmModalOpen}
        editingFilm={editingFilm}
        onCancel={() => setIsFilmModalOpen(false)}
        onSuccess={() => {
          setIsFilmModalOpen(false);
          refetch();
        }}
      />

      <CreateShowtimeModal
        open={isShowtimeModalOpen}
        film={selectedFilmForShowtime}
        onCancel={() => setIsShowtimeModalOpen(false)}
        onSuccess={() => {
          setIsShowtimeModalOpen(false);
        }}
      />
    </div>
  );
};

export default AdminFilms;
