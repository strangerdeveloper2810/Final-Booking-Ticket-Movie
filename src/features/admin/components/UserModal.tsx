import { type FC, useEffect } from "react";
import { Modal, Form, Input, Select, App } from "antd";
import { useTranslation } from "react-i18next";
import { GROUP_ID } from "@cinefix/utils";
import { useAddUserMutation, useUpdateProfileMutation, useGetUserTypesQuery } from "@cinefix/api-client";

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
  const { t } = useTranslation(["admin", "common", "auth"]);

  const { data: userTypes = [] } = useGetUserTypesQuery();
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (!open) return;

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
        message.success(t("admin:updateSuccess"));
      } else {
        await addUser(payload).unwrap();
        message.success(t("admin:addSuccess"));
      }

      onSuccess();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Error submitting user");
    }
  };

  return (
    <Modal
      open={open}
      title={editingUser ? `${t("admin:editUser")}: ${editingUser.taiKhoan}` : t("admin:addUser")}
      okText={editingUser ? t("admin:save") : t("admin:addUser")}
      cancelText={t("admin:cancel")}
      confirmLoading={isAdding || isUpdating}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="taiKhoan"
          label={t("admin:account")}
          rules={[{ required: true, message: t("admin:account") }]}
        >
          <Input placeholder={t("admin:account")} disabled={!!editingUser} size="large" />
        </Form.Item>

        <Form.Item
          name="matKhau"
          label={t("auth:password")}
          rules={[{ required: !editingUser, message: t("auth:password") }]}
        >
          <Input.Password placeholder={t("auth:password")} size="large" />
        </Form.Item>

        <Form.Item
          name="hoTen"
          label={t("admin:fullName")}
          rules={[{ required: true, message: t("admin:fullName") }]}
        >
          <Input placeholder={t("admin:fullName")} size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("admin:email")}
          rules={[
            { required: true, message: t("admin:email") },
            { type: "email", message: "Email invalid" },
          ]}
        >
          <Input placeholder="example@gmail.com" size="large" />
        </Form.Item>

        <Form.Item
          name="soDt"
          label={t("admin:phone")}
          rules={[{ required: true, message: t("admin:phone") }]}
        >
          <Input placeholder="0901234567" size="large" />
        </Form.Item>

        <Form.Item
          name="maLoaiNguoiDung"
          label={t("admin:userType")}
          rules={[{ required: true, message: t("admin:userType") }]}
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
                <Select.Option value="KhachHang">{t("admin:roleCustomer")}</Select.Option>
                <Select.Option value="QuanTri">{t("admin:roleAdmin")}</Select.Option>
              </>
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
