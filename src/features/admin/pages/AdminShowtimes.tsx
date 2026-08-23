import { type FC, useState } from "react";
import { Form, Select, DatePicker, InputNumber, Button, Card, App } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetFilmListQuery,
  useGetCinemaSystemsQuery,
  useGetCinemaClustersQuery,
  useCreateShowtimeMutation,
} from "shared/services/movieApi";
import SEO from "shared/components/SEO/SEO";

/**
 * EN: Admin Showtime Management page — dedicated form for creating new showtime schedules (`TaoLichChieu`).
 * VI: Trang Quản lý Lịch Chiếu dành cho Admin — form dedicated để tạo lịch chiếu phim mới (`TaoLichChieu`).
 */
const AdminShowtimes: FC = () => {
  const [form] = Form.useForm();
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const { message } = App.useApp();

  const { data: films = [], isLoading: loadingFilms } = useGetFilmListQuery();
  const { data: cinemaSystems = [], isLoading: loadingSystems } = useGetCinemaSystemsQuery();
  const { data: cinemaClusters = [], isLoading: loadingClusters } = useGetCinemaClustersQuery(
    selectedSystem,
    { skip: !selectedSystem }
  );

  const [createShowtime, { isLoading: isSubmitting }] = useCreateShowtimeMutation();

  const handleSystemChange = (systemId: string) => {
    setSelectedSystem(systemId);
    form.setFieldsValue({ maCumRap: undefined, maRap: undefined });
  };

  const handleClusterChange = (clusterId: string) => {
    const cluster = cinemaClusters.find((c) => c.maCumRap === clusterId);
    if (cluster && cluster.danhSachRap && cluster.danhSachRap.length > 0) {
      form.setFieldsValue({ maRap: cluster.danhSachRap[0].maRap });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        maPhim: Number(values.maPhim),
        ngayChieuGioChieu: dayjs(values.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm:ss"),
        maRap: String(values.maRap),
        giaVe: Number(values.giaVe),
      };

      await createShowtime(payload).unwrap();
      message.success("Tạo lịch chiếu thành công!");
      form.resetFields();
      setSelectedSystem("");
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Có lỗi xảy ra khi tạo lịch chiếu!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SEO title="Tạo Lịch Chiếu — Cinefix Admin" description="Tạo lịch chiếu phim mới" />

      <Card className="bg-surface border-border">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div className="p-3 bg-primary/10 rounded-xl text-primary text-2xl">
            <CalendarOutlined />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Tạo Lịch Chiếu Phim Mới</h1>
            <p className="text-text-secondary text-sm">
              Chọn phim, hệ thống rạp, cụm rạp và thiết lập thời gian chiếu + giá vé.
            </p>
          </div>
        </div>

        <Form form={form} layout="vertical" initialValues={{ giaVe: 75000 }}>
          <Form.Item
            name="maPhim"
            label="Chọn Phim Chiếu"
            rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
          >
            <Select
              placeholder="Chọn phim"
              size="large"
              loading={loadingFilms}
              showSearch
              optionFilterProp="children"
            >
              {films.map((film: any) => (
                <Select.Option key={film.maPhim} value={film.maPhim}>
                  [{film.maPhim}] {film.tenPhim}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Hệ Thống Rạp">
            <Select
              placeholder="Chọn hệ thống rạp"
              size="large"
              loading={loadingSystems}
              onChange={handleSystemChange}
              value={selectedSystem || undefined}
            >
              {cinemaSystems.map((system: any) => (
                <Select.Option key={system.maHeThongRap} value={system.maHeThongRap}>
                  {system.tenHeThongRap} ({system.maHeThongRap})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="maCumRap"
            label="Cụm Rạp"
            rules={[{ required: true, message: "Vui lòng chọn cụm rạp!" }]}
          >
            <Select
              placeholder="Chọn cụm rạp"
              size="large"
              loading={loadingClusters}
              disabled={!selectedSystem}
              onChange={handleClusterChange}
            >
              {cinemaClusters.map((cluster: any) => (
                <Select.Option key={cluster.maCumRap} value={cluster.maCumRap}>
                  {cluster.tenCumRap}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="maRap"
            label="Mã Rạp Chiếu"
            rules={[{ required: true, message: "Vui lòng chọn rạp chiếu!" }]}
          >
            <InputNumber placeholder="Nhập mã rạp chiếu" className="w-full" size="large" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="ngayChieuGioChieu"
              label="Ngày Giờ Chiếu"
              rules={[{ required: true, message: "Vui lòng chọn ngày giờ chiếu!" }]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm:ss"
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="giaVe"
              label="Giá Vé (VNĐ)"
              rules={[{ required: true, message: "Vui lòng nhập giá vé!" }]}
            >
              <InputNumber
                min={50000}
                max={200000}
                step={5000}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                className="w-full"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="pt-4">
            <Button
              type="primary"
              size="large"
              block
              loading={isSubmitting}
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary-hover font-bold h-12 text-base shadow-lg shadow-primary/30 border-none"
            >
              Tạo Lịch Chiếu Mới
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminShowtimes;
