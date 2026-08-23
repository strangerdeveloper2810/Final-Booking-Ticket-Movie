import { type FC, useState } from "react";
import { Table, Button, Input, Card, Tag, Space, Popconfirm, App, Tooltip } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useGetFilmListQuery, useDeleteFilmMutation } from "shared/services/movieApi";
import FilmModal from "../components/FilmModal";
import CreateShowtimeModal from "../components/CreateShowtimeModal";
import SEO from "shared/components/SEO/SEO";

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
      message.success("Xóa phim thành công!");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Không thể xóa phim này!");
    }
  };

  const columns = [
    {
      title: "Mã Phim",
      dataIndex: "maPhim",
      key: "maPhim",
      width: 90,
      sorter: (a: any, b: any) => a.maPhim - b.maPhim,
    },
    {
      title: "Hình Ảnh",
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
      title: "Tên Phim",
      dataIndex: "tenPhim",
      key: "tenPhim",
      render: (text: string) => <span className="font-bold text-text-primary">{text}</span>,
    },
    {
      title: "Mô Tả",
      dataIndex: "moTa",
      key: "moTa",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Trạng Thái",
      key: "status",
      width: 180,
      render: (_: any, record: any) => (
        <div className="flex flex-wrap gap-1">
          {record.dangChieu && <Tag color="green">Đang chiếu</Tag>}
          {record.sapChieu && <Tag color="blue">Sắp chiếu</Tag>}
          {record.hot && <Tag color="red">HOT</Tag>}
        </div>
      ),
    },
    {
      title: "Đánh Giá",
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
      title: "Thao Tác",
      key: "actions",
      width: 160,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Tạo lịch chiếu">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<CalendarOutlined />}
              onClick={() => handleOpenShowtimeModal(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa thông tin">
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa phim">
            <Popconfirm
              title="Xác nhận xóa"
              description={`Bạn có chắc chắn muốn xóa phim "${record.tenPhim}"?`}
              onConfirm={() => handleDeleteFilm(record.maPhim)}
              okText="Xóa"
              cancelText="Hủy"
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
      <SEO title="Quản Lý Phim — Cinefix Admin" description="Quản lý danh sách phim" />

      <Card className="bg-surface border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Quản Lý Danh Sách Phim</h1>
            <p className="text-text-secondary text-sm">
              Tìm kiếm, thêm mới, cập nhật thông tin và tạo lịch chiếu cho các bộ phim.
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAddModal}
            className="bg-primary hover:bg-primary-hover font-semibold border-none"
          >
            Thêm Phim Mới
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm phim theo tên..."
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
