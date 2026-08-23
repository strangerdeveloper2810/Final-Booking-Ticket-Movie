import { type FC, useEffect } from "react";
import { Modal, Form, Input, Select, App } from "antd";
import { GROUP_ID } from "shared/utils/setting";
import { useAddUserMutation, useUpdateProfileMutation, useGetUserTypesQuery } from "shared/services/movieApi";

interface UserModalProps {
  open: boolean;
  editingUser: any | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * EN: Modal component for creating or editing user accounts.
 * VI: Component modal để tạo mới hoặc chỉnh sửa tài khoản người dùng.
 */
const UserModal: FC<UserModalProps> = ({ open, editingUser, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const { data: userTypes = [] } = useGetUserTypesQuery();
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue({
        taiKhoan: editingUser.taiKhoan,
        matKhau: editingUser.matKhau || "",
        hoTen: editingUser.hoTen,
        email: editingUser.email,
        soDt: editingUser.soDt || editingUser.soDT,
        maLoaiNguoiDung: editingUser.maLoaiNguoiDung || "KhachHang",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ maLoaiNguoiDung: "KhachHang" });
    }
  }, [editingUser, form, open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        maNhom: GROUP_ID,
      };

      if (editingUser) {
        await updateUser(payload).unwrap();
        message.success("Cập nhật tài khoản người dùng thành công!");
      } else {
        await addUser(payload).unwrap();
        message.success("Thêm người dùng mới thành công!");
      }

      onSuccess();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      open={open}
      title={editingUser ? `Chỉnh Sửa Người Dùng: ${editingUser.taiKhoan}` : "Thêm Người Dùng Mới"}
      okText={editingUser ? "Lưu Thay Đổi" : "Thêm Người Dùng"}
      cancelText="Hủy Bỏ"
      confirmLoading={isAdding || isUpdating}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="taiKhoan"
          label="Tài Khoản"
          rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
        >
          <Input placeholder="Nhập tên tài khoản" disabled={!!editingUser} size="large" />
        </Form.Item>

        <Form.Item
          name="matKhau"
          label="Mật Khẩu"
          rules={[{ required: !editingUser, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" size="large" />
        </Form.Item>

        <Form.Item
          name="hoTen"
          label="Họ và Tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên đầy đủ" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input placeholder="example@gmail.com" size="large" />
        </Form.Item>

        <Form.Item
          name="soDt"
          label="Số Điện Thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="0901234567" size="large" />
        </Form.Item>

        <Form.Item
          name="maLoaiNguoiDung"
          label="Loại Người Dùng"
          rules={[{ required: true, message: "Vui lòng chọn loại người dùng!" }]}
        >
          <Select size="large">
            {userTypes.length > 0 ? (
              userTypes.map((type) => (
                <Select.Option key={type.maLoaiNguoiDung} value={type.maLoaiNguoiDung}>
                  {type.tenLoai} ({type.maLoaiNguoiDung})
                </Select.Option>
              ))
            ) : (
              <>
                <Select.Option value="KhachHang">Khách Hàng (KhachHang)</Select.Option>
                <Select.Option value="QuanTri">Quản Trị (QuanTri)</Select.Option>
              </>
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
