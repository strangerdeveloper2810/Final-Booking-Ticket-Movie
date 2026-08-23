import { type FC } from "react";
import { Modal, Tag, Divider, Button } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined, QrcodeOutlined, CheckCircleFilled } from "@ant-design/icons";

interface TicketQRModalProps {
  open: boolean;
  ticket: any | null;
  onClose: () => void;
}

/**
 * EN: Interactive E-Ticket modal component displaying showtime details, seat tags,
 * and a scan-ready QR code for theater admittance.
 * VI: Component modal Vé Điện Tử hiển thị chi tiết suất chiếu, danh sách ghế đặt
 * và mã QR Code sẵn sàng quét để vào phòng chiếu.
 */
const TicketQRModal: FC<TicketQRModalProps> = ({ open, ticket, onClose }) => {
  if (!ticket) return null;

  // Generate a mock QR Code URL using quickchart QR API based on booking code + seat numbers
  const qrData = `CINEFIX-TICKET-${ticket.maVe || ticket.maLichChieu || Date.now()}-${ticket.tenPhim}`;
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=200&margin=1`;

  const seats = ticket.danhSachGhe || [];

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={480}
      className="ticket-modal"
    >
      <div className="text-center pt-2 pb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 text-2xl mb-2">
          <CheckCircleFilled />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Vé Xem Phim Điện Tử</h2>
        <p className="text-text-secondary text-xs">Vui lòng xuất trình mã QR này tại quầy rạp chiếu</p>
      </div>

      <div className="bg-background border border-border rounded-xl p-5 space-y-4">
        <div className="flex gap-4 items-center">
          {ticket.hinhAnh && (
            <img
              src={ticket.hinhAnh}
              alt={ticket.tenPhim}
              className="w-16 h-24 object-cover rounded-lg shadow border border-border"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/200/300";
              }}
            />
          )}
          <div className="space-y-1">
            <h3 className="font-bold text-text-primary text-base leading-tight">
              {ticket.tenPhim}
            </h3>
            <p className="text-xs text-text-secondary flex items-center gap-1">
              <EnvironmentOutlined className="text-primary" />
              {ticket.tenCumRap || ticket.danhSachGhe?.[0]?.tenHeThongRap || "Cụm Rạp Cinefix"}
            </p>
            <p className="text-xs text-secondary flex items-center gap-1 font-semibold">
              <ClockCircleOutlined />
              {ticket.ngayDat || ticket.ngayChieu ? `${ticket.ngayDat || ticket.ngayChieu}` : "Hôm nay"}
            </p>
          </div>
        </div>

        <Divider className="my-2 border-border" />

        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center p-3 bg-surface rounded-xl border border-border">
          <img
            src={qrCodeUrl}
            alt="Ticket QR Code"
            className="w-40 h-40 bg-white p-2 rounded-lg shadow-sm"
          />
          <span className="text-[11px] text-text-secondary font-mono mt-2 tracking-wider">
            MÃ VÉ: #{ticket.maVe || Math.floor(100000 + Math.random() * 900000)}
          </span>
        </div>

        {/* Seats & Price */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-start">
            <span className="text-text-secondary">Danh sách ghế:</span>
            <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
              {seats.map((seat: any, idx: number) => (
                <Tag key={idx} color="red" className="font-bold text-xs m-0">
                  {seat.tenGhe || seat.maGhe}
                </Tag>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-text-secondary font-medium">Tổng tiền:</span>
            <span className="text-base font-extrabold text-primary">
              {(ticket.giaVe || ticket.tongTien || seats.reduce((acc: number, s: any) => acc + (s.giaVe || 75000), 0)).toLocaleString()}{" "}
              <span className="text-xs font-normal">VNĐ</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button block onClick={onClose} size="large">
          Đóng
        </Button>
        <Button
          type="primary"
          block
          size="large"
          icon={<QrcodeOutlined />}
          onClick={() => window.print()}
          className="bg-primary hover:bg-primary-hover border-none font-bold"
        >
          In / Lưu Vé
        </Button>
      </div>
    </Modal>
  );
};

export default TicketQRModal;
