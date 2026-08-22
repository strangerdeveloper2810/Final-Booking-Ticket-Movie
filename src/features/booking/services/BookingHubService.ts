import * as signalR from "@microsoft/signalr";
import { API_CONFIG } from "shared/constants/appConstants";

/**
 * The seat-booking SignalR hub lives at the API host root, NOT under the
 * `/api` prefix that every REST call in this app goes through (that prefix
 * is specific to the MVC/WebAPI routes, not the SignalR hub mapping) —
 * so it's derived by stripping a trailing `/api` off API_CONFIG.DOMAIN
 * rather than reusing the REST `http`/`DOMAIN` constant directly.
 */
const HUB_URL = `${API_CONFIG.DOMAIN.replace(/\/api\/?$/, "")}/DatVeHub`;

export const HUB_METHOD = {
  LOAD_DANH_SACH_GHE: "loadDanhSachGhe",
  LOAD_DANH_SACH_GHE_DA_DAT: "loadDanhSachGheDaDat",
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

/**
 * Lazily starts (or awaits an in-flight start of) the shared hub connection.
 * Only ever called once the user actually opens a booking page — unlike the
 * legacy course pattern of connecting before the app even renders, a failed
 * or slow hub connection here can never block the rest of the app.
 */
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
  /** Joins the realtime "room" for a showtime by invoking loadDanhSachGhe — the server responds by broadcasting loadDanhSachGheDaDat to every client in that room whenever the seat map changes. */
  joinShowtimeRoom: async (maLichChieu: string | number): Promise<void> => {
    const conn = await ensureStarted();
    await conn.invoke(HUB_METHOD.LOAD_DANH_SACH_GHE, String(maLichChieu));
  },

  /** Registers a listener for realtime seat-map broadcasts. Returns an unsubscribe function. */
  onSeatMapUpdated: <T = unknown>(callback: (payload: T) => void): (() => void) => {
    const conn = getConnection();
    conn.on(HUB_METHOD.LOAD_DANH_SACH_GHE_DA_DAT, callback);
    return () => conn.off(HUB_METHOD.LOAD_DANH_SACH_GHE_DA_DAT, callback);
  },
};

export default BookingHubService;
