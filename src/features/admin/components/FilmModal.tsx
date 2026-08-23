import { type FC, useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Switch, Rate, Upload, Button, App } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { GROUP_ID } from "shared/utils/setting";
import { useAddFilmUploadMutation, useUpdateFilmUploadMutation } from "shared/services/movieApi";

interface FilmModalProps {
  open: boolean;
  editingFilm: any | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * EN: Modal component for creating or editing a movie with image poster upload.
 * Formats data as `FormData` to submit to `ThemPhimUploadHinh`/`CapNhatPhimUpload`.
 * VI: Component modal để tạo mới hoặc chỉnh sửa phim kèm upload hình ảnh poster.
 * Định dạng dữ liệu thành `FormData` để gửi tới API `ThemPhimUploadHinh`/`CapNhatPhimUpload`.
 */
const FilmModal: FC<FilmModalProps> = ({ open, editingFilm, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const { message } = App.useApp();

  const [addFilm, { isLoading: isAdding }] = useAddFilmUploadMutation();
  const [updateFilm, { isLoading: isUpdating }] = useUpdateFilmUploadMutation();

  useEffect(() => {
    if (editingFilm) {
      form.setFieldsValue({
        tenPhim: editingFilm.tenPhim,
        trailer: editingFilm.trailer,
        moTa: editingFilm.moTa,
        ngayKhoiChieu: editingFilm.ngayKhoiChieu ? dayjs(editingFilm.ngayKhoiChieu) : dayjs(),
        dangChieu: editingFilm.dangChieu ?? true,
        sapChieu: editingFilm.sapChieu ?? false,
        hot: editingFilm.hot ?? false,
        danhGia: editingFilm.danhGia || 10,
      });
      if (editingFilm.hinhAnh) {
        setFileList([
          {
            uid: "-1",
            name: "poster.png",
            status: "done",
            url: editingFilm.hinhAnh,
          },
        ]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [editingFilm, form, open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append("tenPhim", values.tenPhim);
      formData.append("trailer", values.trailer || "");
      formData.append("moTa", values.moTa || "");
      formData.append("maNhom", GROUP_ID);
      formData.append("ngayKhoiChieu", dayjs(values.ngayKhoiChieu).format("DD/MM/YYYY"));
      formData.append("dangChieu", values.dangChieu ? "true" : "false");
      formData.append("sapChieu", values.sapChieu ? "true" : "false");
      formData.append("hot", values.hot ? "true" : "false");
      formData.append("danhGia", String(values.danhGia || 10));

      if (editingFilm) {
        formData.append("maPhim", String(editingFilm.maPhim));
      }

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("File", fileList[0].originFileObj);
      }

      if (editingFilm) {
        await updateFilm(formData).unwrap();
        message.success("Cập nhật phim thành công!");
      } else {
        await addFilm(formData).unwrap();
        message.success("Thêm phim mới thành công!");
      }

      onSuccess();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      open={open}
      title={editingFilm ? `Chỉnh Sửa Phim: ${editingFilm.tenPhim}` : "Thêm Phim Mới"}
      okText={editingFilm ? "Lưu Thay Đổi" : "Thêm Phim"}
      cancelText="Hủy Bỏ"
      confirmLoading={isAdding || isUpdating}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ dangChieu: true, danhGia: 10 }}>
        <Form.Item
          name="tenPhim"
          label="Tên Phim"
          rules={[{ required: true, message: "Vui lòng nhập tên phim!" }]}
        >
          <Input placeholder="Nhập tên phim" size="large" />
        </Form.Item>

        <Form.Item name="trailer" label="Link Trailer (YouTube URL)">
          <Input placeholder="https://www.youtube.com/watch?v=..." />
        </Form.Item>

        <Form.Item name="moTa" label="Mô Tả Phim">
          <Input.TextArea rows={3} placeholder="Nhập tóm tắt nội dung phim" />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="ngayKhoiChieu"
            label="Ngày Khởi Chiếu"
            rules={[{ required: true, message: "Vui lòng chọn ngày khởi chiếu!" }]}
          >
            <DatePicker format="DD/MM/YYYY" className="w-full" size="large" />
          </Form.Item>

          <Form.Item name="danhGia" label="Đánh Giá (1 - 10 sao)">
            <InputNumber min={1} max={10} className="w-full" size="large" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-background p-4 rounded-lg mb-4 border border-border">
          <Form.Item name="dangChieu" label="Đang Chiếu" valuePropName="checked" className="mb-0">
            <Switch />
          </Form.Item>
          <Form.Item name="sapChieu" label="Sắp Chiếu" valuePropName="checked" className="mb-0">
            <Switch />
          </Form.Item>
          <Form.Item name="hot" label="Phim Hot" valuePropName="checked" className="mb-0">
            <Switch />
          </Form.Item>
        </div>

        <Form.Item label="Hình Ảnh Poster (File Upload)">
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          >
            <Button icon={<UploadOutlined />}>Tải Lên Poster Mới</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FilmModal;
