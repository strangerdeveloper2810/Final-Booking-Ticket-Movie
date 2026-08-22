import { BookingTicket } from "./BookingTicketType";

/**
 * EN: Empty-object placeholder used as the initial `bookingDetail` state
 * before the showtime's seat map has loaded from the API. An empty object
 * (rather than `undefined`/`null`) lets the UI safely read nested fields via
 * `lodash/get` while data is still in flight.
 * VI: Giá trị object rỗng dùng làm trạng thái `bookingDetail` ban đầu, trước
 * khi sơ đồ ghế của lịch chiếu được tải xong từ API. Dùng object rỗng (thay
 * vì `undefined`/`null`) giúp giao diện đọc an toàn các trường lồng nhau
 * bằng `lodash/get` trong lúc dữ liệu vẫn đang được tải.
 */
export const initialBookingTicket: BookingTicket | Record<string, never> = {};
