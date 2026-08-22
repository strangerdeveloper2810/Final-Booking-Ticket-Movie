/**
 * EN: Redux action-type string constants for the booking feature's sagas.
 * Kept as plain string constants (not an enum) so they can be used directly
 * as saga `takeLatest`/`take` patterns and plain dispatched action `type`s.
 * VI: Các hằng số chuỗi định danh (action type) cho redux-saga của tính năng
 * đặt vé. Giữ dưới dạng hằng số chuỗi thuần (không dùng enum) để có thể dùng
 * trực tiếp làm mẫu cho `takeLatest`/`take` trong saga cũng như `type` của
 * các action được dispatch thông thường.
 */
/** EN: Fetches the seat map + showtime info for a showtime via REST. VI: Tải sơ đồ ghế + thông tin lịch chiếu qua REST. */
export const GET_TICKET_API = "GET_TICKET_API";
/** EN: Submits the selected seats to the booking REST endpoint. VI: Gửi danh sách ghế đã chọn tới API đặt vé. */
export const BOOK_TICKET_API = "BOOK_TICKET_API";
/** EN: Joins the DatVeHub SignalR room for a showtime to receive realtime seat updates. VI: Tham gia phòng SignalR của DatVeHub cho một lịch chiếu để nhận cập nhật ghế theo thời gian thực. */
export const JOIN_SEAT_ROOM = "JOIN_SEAT_ROOM";
/** EN: Leaves the current DatVeHub room, stopping realtime seat updates. VI: Rời khỏi phòng DatVeHub hiện tại, dừng nhận cập nhật ghế theo thời gian thực. */
export const LEAVE_SEAT_ROOM = "LEAVE_SEAT_ROOM";
