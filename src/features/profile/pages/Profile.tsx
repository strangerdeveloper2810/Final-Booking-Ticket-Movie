import { type FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, Card, Form, Input, Button, Tag, App, Avatar, Skeleton, Empty } from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  QrcodeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { RootState } from "app/store";
import { useGetProfileQuery, useUpdateProfileMutation } from "shared/services/movieApi";
import { APP_ROUTES } from "shared/constants/routes";
import { GROUP_ID } from "shared/utils/setting";
import TicketQRModal from "../components/TicketQRModal";
import SEO from "shared/components/SEO/SEO";

/**
 * EN: User Profile & Booking History page — displays personal account details (Tab 1)
 * and past movie ticket purchase history with E-Ticket QR code modals (Tab 2).
 * VI: Trang Cá Nhân & Lịch Sử Đặt Vé — hiển thị chi tiết thông tin tài khoản (Tab 1)
 * và lịch sử mua vé xem phim kèm modal xem Vé Điện Tử mã QR (Tab 2).
 */
const Profile: FC = () => {
  const [form] = Form.useForm();
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const { message } = App.useApp();
  const { t } = useTranslation(["auth", "common", "booking"]);
  const { userLogin } = useSelector((state: RootState) => state.UserSaga);

  const { data: profile, isLoading, refetch } = useGetProfileQuery(undefined, {
    skip: !userLogin,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (!userLogin) {
      navigate(APP_ROUTES.LOGIN);
      return;
    }

    if (profile) {
      form.setFieldsValue({
        taiKhoan: profile.taiKhoan,
        hoTen: profile.hoTen,
        email: profile.email,
        soDT: profile.soDT || profile.soDt,
        matKhau: profile.matKhau || "",
        maLoaiNguoiDung: profile.maLoaiNguoiDung || "KhachHang",
      });
    }
  }, [profile, userLogin, form, navigate]);

  const handleUpdateProfile = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        maNhom: GROUP_ID,
      };

      await updateProfile(payload).unwrap();
      message.success("Cập nhật thông tin cá nhân thành công!");
      refetch();
    } catch (error: any) {
      message.error(error?.data?.content || error?.message || "Cập nhật không thành công!");
    }
  };

  const handleOpenQRModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsQRModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </div>
    );
  }

  const bookingHistory = profile?.thongTinDatVe || [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO title="Trang Cá Nhân & Lịch Sử Đặt Vé — Cinefix" description="Quản lý tài khoản và xem lịch sử đặt vé xem phim" />

      {/* Profile Header Banner */}
      <Card className="bg-surface border-border overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-2">
          <Avatar
            size={84}
            icon={<UserOutlined />}
            className="bg-primary text-4xl shadow-md border-2 border-border"
          />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
              <h1 className="text-2xl font-extrabold text-text-primary">
                {profile?.hoTen || userLogin?.hoTen || "Người Dùng Cinefix"}
              </h1>
              <Tag color="red" className="font-bold uppercase text-xs">
                {profile?.maLoaiNguoiDung || "KhachHang"}
              </Tag>
            </div>
            <p className="text-text-secondary text-sm flex items-center justify-center sm:justify-start gap-2">
              <MailOutlined /> {profile?.email || "Chưa cập nhật email"}
            </p>
            <p className="text-text-secondary text-xs flex items-center justify-center sm:justify-start gap-2">
              <UserOutlined /> Tài khoản: <span className="font-semibold text-text-primary">{profile?.taiKhoan}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs View */}
      <Tabs
        defaultActiveKey="profile"
        type="card"
        className="bg-surface p-4 sm:p-6 rounded-xl border border-border"
        items={[
          {
            key: "profile",
            label: (
              <span className="flex items-center gap-2 font-bold px-2">
                <UserOutlined /> Thông Tin Tài Khoản
              </span>
            ),
            children: (
              <div className="max-w-2xl py-4">
                <Form form={form} layout="vertical">
                  <Form.Item label="Tài Khoản" name="taiKhoan">
                    <Input disabled size="large" prefix={<UserOutlined className="text-text-secondary" />} />
                  </Form.Item>

                  <Form.Item
                    label="Họ và Tên"
                    name="hoTen"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                  >
                    <Input size="large" prefix={<UserOutlined className="text-text-secondary" />} />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input size="large" prefix={<MailOutlined className="text-text-secondary" />} />
                  </Form.Item>

                  <Form.Item
                    label="Số Điện Thoại"
                    name="soDT"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                  >
                    <Input size="large" prefix={<PhoneOutlined className="text-text-secondary" />} />
                  </Form.Item>

                  <Form.Item label="Mật Khẩu Mới" name="matKhau">
                    <Input.Password
                      placeholder="Để trống nếu không muốn đổi mật khẩu"
                      size="large"
                      prefix={<LockOutlined className="text-text-secondary" />}
                    />
                  </Form.Item>

                  <div className="pt-2">
                    <Button
                      type="primary"
                      size="large"
                      loading={isUpdating}
                      onClick={handleUpdateProfile}
                      className="bg-primary hover:bg-primary-hover font-bold h-12 text-base shadow-lg shadow-primary/30 border-none"
                    >
                      Lưu Thay Đổi Thông Tin
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
          {
            key: "history",
            label: (
              <span className="flex items-center gap-2 font-bold px-2">
                <HistoryOutlined /> Lịch Sử Đặt Vé ({bookingHistory.length})
              </span>
            ),
            children: (
              <div className="py-4 space-y-4">
                {bookingHistory.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookingHistory.map((item: any, index: number) => {
                      const seats = item.danhSachGhe || [];
                      const cinemaName = seats[0]?.tenHeThongRap || "Cụm Rạp Cinefix";
                      const theaterName = seats[0]?.tenCumRap || "Phòng Chiếu Chi Tiết";

                      return (
                        <Card
                          key={index}
                          className="bg-background border-border hover:border-primary transition-all duration-300 shadow-sm"
                        >
                          <div className="flex gap-4">
                            {item.hinhAnh && (
                              <img
                                src={item.hinhAnh}
                                alt={item.tenPhim}
                                className="w-20 h-28 object-cover rounded-lg shadow border border-border shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://picsum.photos/200/300";
                                }}
                              />
                            )}
                            <div className="flex-1 space-y-2">
                              <h3 className="font-bold text-text-primary text-base line-clamp-1">
                                {item.tenPhim}
                              </h3>
                              <p className="text-xs text-text-secondary flex items-center gap-1">
                                <EnvironmentOutlined className="text-primary" />
                                {cinemaName} — {theaterName}
                              </p>
                              <p className="text-xs text-secondary font-semibold flex items-center gap-1">
                                <ClockCircleOutlined />
                                {item.ngayDat ? `Ngày đặt: ${item.ngayDat}` : "Vé gần đây"}
                              </p>

                              <div className="flex flex-wrap gap-1 pt-1">
                                <span className="text-xs text-text-secondary mr-1">Ghế:</span>
                                {seats.slice(0, 5).map((seat: any, i: number) => (
                                  <Tag key={i} color="red" className="font-bold text-xs m-0">
                                    {seat.tenGhe}
                                  </Tag>
                                ))}
                                {seats.length > 5 && (
                                  <Tag className="text-xs m-0">+{seats.length - 5} ghế</Tag>
                                )}
                              </div>

                              <div className="pt-2 flex items-center justify-between border-t border-border">
                                <span className="text-sm font-bold text-primary">
                                  {(item.giaVe * seats.length || 75000 * seats.length).toLocaleString()} VNĐ
                                </span>
                                <Button
                                  type="primary"
                                  ghost
                                  size="small"
                                  icon={<QrcodeOutlined />}
                                  onClick={() => handleOpenQRModal(item)}
                                >
                                  Mã Vé QR
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Empty
                    description="Bạn chưa thực hiện giao dịch đặt vé nào"
                    className="py-12"
                  >
                    <Button type="primary" onClick={() => navigate(APP_ROUTES.HOME)}>
                      Đặt Vé Ngay
                    </Button>
                  </Empty>
                )}
              </div>
            ),
          },
        ]}
      />

      <TicketQRModal
        open={isQRModalOpen}
        ticket={selectedTicket}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
