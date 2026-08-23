import { type FC, useState } from "react";
import { Modal, Form, Select, DatePicker, InputNumber, App } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  useGetCinemaSystemsQuery,
  useGetCinemaClustersQuery,
  useCreateShowtimeMutation,
} from "@cinefix/api-client";

interface CreateShowtimeModalProps {
  open: boolean;
  film: any | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * EN: Modal component for creating a new showtime schedule for a movie.
 * VI: Component modal để tạo lịch chiếu mới cho một bộ phim.
 */
const CreateShowtimeModal: FC<CreateShowtimeModalProps> = ({ open, film, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const { message } = App.useApp();
  const { t } = useTranslation(["admin", "common"]);

  const { data: cinemaSystems = [] } = useGetCinemaSystemsQuery();
  const { data: cinemaClusters = [] } = useGetCinemaClustersQuery(selectedSystem, {
    skip: !selectedSystem,
  });

  const [createShowtime, { isLoading }] = useCreateShowtimeMutation();

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
      if (!film?.maPhim) return;

      const payload = {
        maPhim: Number(film.maPhim),
        ngayChieuGioChieu: dayjs(values.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm:ss"),
        maRap: String(values.maRap),
        giaVe: Number(values.giaVe),
      };

      await createShowtime(payload).unwrap();
      message.success(t("admin:addSuccess"));
      onSuccess();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Error creating showtime");
    }
  };

  return (
    <Modal
      open={open}
      title={`${t("admin:createShowtime")}: ${film?.tenPhim || ""}`}
      okText={t("admin:createShowtime")}
      cancelText={t("admin:cancel")}
      confirmLoading={isLoading}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ giaVe: 75000 }} preserve={false}>
        <Form.Item label={t("admin:cinemaSystem")}>
          <Select
            placeholder={t("admin:cinemaSystem")}
            size="large"
            onChange={handleSystemChange}
            value={selectedSystem || undefined}
          >
            {cinemaSystems.map((system) => (
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
            disabled={!selectedSystem}
            onChange={handleClusterChange}
          >
            {cinemaClusters.map((cluster) => (
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
      </Form>
    </Modal>
  );
};

export default CreateShowtimeModal;
