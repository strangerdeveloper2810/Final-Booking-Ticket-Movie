import * as signalR from "@microsoft/signalr";
import { API_CONFIG } from "@cinefix/utils";

const HUB_URL = `${API_CONFIG.DOMAIN.replace(/\/api\/?$/, "")}/DatVeHub`;

export const HUB_METHOD = {
  LOAD_DANH_SACH_GHE: "loadDanhSachGhe",
  LOAD_DANH_SACH_GHE_DA_DAT: "loadDanhSachGheDaDat",
  DAT_GHE: "datGhe",
} as const;

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<void> | null = null;

function getConnection(): signalR.HubConnection {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }
  return connection;
}

async function ensureStarted(): Promise<signalR.HubConnection> {
  const conn = getConnection();
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    startPromise = conn.start();
  }
  if (startPromise) {
    await startPromise;
  }
  return conn;
}

const BookingHubService = {
  joinShowtimeRoom: async (maLichChieu: string | number): Promise<void> => {
    const conn = await ensureStarted();
    await conn.invoke(HUB_METHOD.LOAD_DANH_SACH_GHE, String(maLichChieu));
  },

  sendSelectedSeats: async (
    taiKhoan: string,
    selectedSeats: any[],
    maLichChieu: string | number
  ): Promise<void> => {
    try {
      const conn = await ensureStarted();
      const seatsPayload = JSON.stringify(selectedSeats);
      await conn.invoke(HUB_METHOD.DAT_GHE, taiKhoan, seatsPayload, String(maLichChieu));
    } catch (error) {
      console.error("Failed to send selected seats via SignalR DatVeHub", error);
    }
  },

  onSeatMapUpdated: <T = unknown>(callback: (payload: T) => void): (() => void) => {
    const conn = getConnection();
    conn.on(HUB_METHOD.LOAD_DANH_SACH_GHE_DA_DAT, callback);
    return () => conn.off(HUB_METHOD.LOAD_DANH_SACH_GHE_DA_DAT, callback);
  },
};

export default BookingHubService;
