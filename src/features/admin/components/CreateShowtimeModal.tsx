import { type FC, useState } from "react";
import { Modal, Form, Select, DatePicker, InputNumber, App } from "antd";
import dayjs from "dayjs";
import {
  useGetCinemaSystemsQuery,
  useGetCinemaClustersQuery,
  useCreateShowtimeMutation,
} from "shared/services/movieApi";

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
      message.success(`Tạo lịch chiếu cho phim "${film.tenPhim}" thành công!`);
      onSuccess();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      open={open}
      title={`Tạo Lịch Chiếu: ${film?.tenPhim || ""}`}
      okText="Tạo Lịch Chiếu"
      cancelText="Hủy Bỏ"
      confirmLoading={isLoading}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ giaVe: 75000 }}>
        <Form.Item label="Hệ Thống Rạp">
          <Select
            placeholder="Chọn hệ thống rạp"
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
          label="Cụm Rạp"
          rules={[{ required: true, message: "Vui lòng chọn cụm rạp!" }]}
        >
          <Select
            placeholder="Chọn cụm rạp"
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
          label="Mã Rạp Chiếu"
          rules={[{ required: true, message: "Vui lòng chọn rạp chiếu!" }]}
        >
          <InputNumber placeholder="Nhập mã rạp chiếu" className="w-full" size="large" />
        </Form.Item>

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
      </Form>
    </Modal>
  );
};

export default CreateShowtimeModal;
