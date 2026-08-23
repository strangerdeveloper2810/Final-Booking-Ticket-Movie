import { type FC, useState } from "react";
import { Table, Button, Input, Card, Tag, Space, Popconfirm, App, Tooltip, Select } from "antd";
import {
  UserAddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useGetUserListQuery, useDeleteUserMutation } from "shared/services/movieApi";
import UserModal from "../components/UserModal";
import SEO from "shared/components/SEO/SEO";

/**
 * EN: Admin User Management page — search, filter, add, edit, and delete user accounts.
 * VI: Trang Quản lý Người dùng dành cho Admin — tìm kiếm, lọc, thêm, sửa và xóa tài khoản.
 */
const AdminUsers: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const { message } = App.useApp();
  const { t } = useTranslation(["admin", "common"]);
  const { data: users = [], isLoading, refetch } = useGetUserListQuery({ tuKhoa: searchTerm });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const filteredUsers = users.filter((user: any) => {
    if (roleFilter !== "ALL" && user.maLoaiNguoiDung !== roleFilter) {
      return false;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (taiKhoan: string) => {
    try {
      await deleteUser(taiKhoan).unwrap();
      message.success(t("admin:deleteSuccess"));
      refetch();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Error deleting user");
    }
  };

  const columns = [
    {
      title: t("admin:stt"),
      key: "stt",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("admin:account"),
      dataIndex: "taiKhoan",
      key: "taiKhoan",
      render: (text: string) => <span className="font-bold text-text-primary">{text}</span>,
    },
    {
      title: t("admin:fullName"),
      dataIndex: "hoTen",
      key: "hoTen",
      render: (text: string) => <span>{text || "—"}</span>,
    },
    {
      title: t("admin:email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("admin:phone"),
      dataIndex: "soDt",
      key: "soDt",
      render: (text: string, record: any) => text || record.soDT || "—",
    },
    {
      title: t("admin:userType"),
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
      render: (type: string) => (
        <Tag color={type === "QuanTri" ? "red" : "blue"} className="font-bold">
          {type === "QuanTri" ? t("admin:roleAdmin") : t("admin:roleCustomer")}
        </Tag>
      ),
    },
    {
      title: t("admin:actions"),
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title={t("admin:editUser")}>
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
            />
          </Tooltip>
          <Tooltip title={t("admin:deleteUser")}>
            <Popconfirm
              title={t("admin:deleteUser")}
              description={t("admin:confirmDeleteUser", { account: record.taiKhoan })}
              onConfirm={() => handleDeleteUser(record.taiKhoan)}
              okText={t("admin:deleteUser")}
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
      <SEO title={`${t("admin:userListTitle")} — Cinefix Admin`} description={t("admin:userListSubtitle")} />

      <Card className="bg-surface border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">{t("admin:userListTitle")}</h1>
            <p className="text-text-secondary text-sm">
              {t("admin:userListSubtitle")}
            </p>
          </div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            onClick={handleOpenAddModal}
            className="bg-primary hover:bg-primary-hover font-semibold border-none"
          >
            {t("admin:addUser")}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder={t("admin:searchUserPlaceholder")}
            prefix={<SearchOutlined className="text-text-secondary" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            size="large"
            className="max-w-md"
          />
          <Select
            value={roleFilter}
            onChange={(value) => setRoleFilter(value)}
            size="large"
            className="w-56"
          >
            <Select.Option value="ALL">{t("admin:allRoles")}</Select.Option>
            <Select.Option value="QuanTri">{t("admin:roleAdmin")}</Select.Option>
            <Select.Option value="KhachHang">{t("admin:roleCustomer")}</Select.Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="taiKhoan"
          loading={isLoading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 750 }}
        />
      </Card>

      <UserModal
        open={isUserModalOpen}
        editingUser={editingUser}
        onCancel={() => setIsUserModalOpen(false)}
        onSuccess={() => {
          setIsUserModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default AdminUsers;
