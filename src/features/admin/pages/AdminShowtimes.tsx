import { type FC, useState } from "react";
import { Form, Select, DatePicker, InputNumber, Button, Card, App } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(["admin", "common"]);

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
      message.success(t("admin:addSuccess"));
      form.resetFields();
      setSelectedSystem("");
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Error creating showtime");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SEO title={`${t("admin:createShowtimeTitle")} — Cinefix Admin`} description={t("admin:createShowtimeSub")} />

      <Card className="bg-surface border-border">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div className="p-3 bg-primary/10 rounded-xl text-primary text-2xl">
            <CalendarOutlined />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{t("admin:createShowtimeTitle")}</h1>
            <p className="text-text-secondary text-sm">
              {t("admin:createShowtimeSub")}
            </p>
          </div>
        </div>

        <Form form={form} layout="vertical" initialValues={{ giaVe: 75000 }}>
          <Form.Item
            name="maPhim"
            label={t("admin:selectFilm")}
            rules={[{ required: true, message: t("admin:selectFilm") }]}
          >
            <Select
              placeholder={t("admin:selectFilm")}
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

          <Form.Item label={t("admin:cinemaSystem")}>
            <Select
              placeholder={t("admin:cinemaSystem")}
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
            label={t("admin:cinemaCluster")}
            rules={[{ required: true, message: t("admin:cinemaCluster") }]}
          >
            <Select
              placeholder={t("admin:cinemaCluster")}
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
            label={t("admin:theaterId")}
            rules={[{ required: true, message: t("admin:theaterId") }]}
          >
            <InputNumber placeholder={t("admin:theaterId")} className="w-full" size="large" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="ngayChieuGioChieu"
              label={t("admin:showtimeDateTime")}
              rules={[{ required: true, message: t("admin:showtimeDateTime") }]}
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
              label={t("admin:ticketPrice")}
              rules={[{ required: true, message: t("admin:ticketPrice") }]}
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
              {t("admin:submitCreateShowtime")}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminShowtimes;
