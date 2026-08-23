import { type FC, useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Switch, Rate, Upload, Button, App } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(["admin", "common"]);

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
        message.success(t("admin:updateSuccess"));
      } else {
        await addFilm(formData).unwrap();
        message.success(t("admin:addSuccess"));
      }

      onSuccess();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Error submitting film");
    }
  };

  return (
    <Modal
      open={open}
      title={editingFilm ? `${t("admin:editMovie")}: ${editingFilm.tenPhim}` : t("admin:addMovie")}
      okText={editingFilm ? t("admin:save") : t("admin:addMovie")}
      cancelText={t("admin:cancel")}
      confirmLoading={isAdding || isUpdating}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ dangChieu: true, danhGia: 10 }}>
        <Form.Item
          name="tenPhim"
          label={t("admin:movieTitle")}
          rules={[{ required: true, message: t("admin:movieTitle") }]}
        >
          <Input placeholder={t("admin:movieTitle")} size="large" />
        </Form.Item>

        <Form.Item name="trailer" label="Trailer (YouTube URL)">
          <Input placeholder="https://www.youtube.com/watch?v=..." />
        </Form.Item>

        <Form.Item name="moTa" label={t("admin:description")}>
          <Input.TextArea rows={3} placeholder={t("admin:description")} />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="ngayKhoiChieu"
            label="Release Date"
            rules={[{ required: true, message: "Release date required" }]}
          >
            <DatePicker format="DD/MM/YYYY" className="w-full" size="large" />
          </Form.Item>

          <Form.Item name="danhGia" label={t("admin:rating")}>
            <InputNumber min={1} max={10} className="w-full" size="large" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-background p-4 rounded-lg mb-4 border border-border">
          <Form.Item name="dangChieu" label={t("admin:showing")} valuePropName="checked" className="mb-0">
            <Switch />
          </Form.Item>
          <Form.Item name="sapChieu" label={t("admin:comingSoon")} valuePropName="checked" className="mb-0">
            <Switch />
          </Form.Item>
          <Form.Item name="hot" label={t("admin:hot")} valuePropName="checked" className="mb-0">
            <Switch />
          </Form.Item>
        </div>

        <Form.Item label={t("admin:poster")}>
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          >
            <Button icon={<UploadOutlined />}>{t("admin:poster")}</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FilmModal;
