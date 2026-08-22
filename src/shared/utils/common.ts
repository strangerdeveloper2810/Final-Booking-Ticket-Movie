import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";

/**
 * EN: Formats an ISO/parsable date string into the "DD/MM/YYYY ~ HH:mm"
 * display format used for showtime schedules across the booking UI.
 * VI: Định dạng một chuỗi ngày (ISO/parse được) thành dạng hiển thị
 * "DD/MM/YYYY ~ HH:mm" dùng cho lịch chiếu trong giao diện đặt vé.
 * @param dateString - EN: raw date string from the API. VI: chuỗi ngày thô từ API.
 * @returns EN: formatted "date ~ time" string, or "" if no date was given. VI: chuỗi "ngày ~ giờ" đã định dạng, hoặc "" nếu không có ngày.
 */
export const formatScheduleMovie = (dateString: string) => {
  if (!isEmpty(dateString)) {
    const date = dayjs(dateString).format("DD/MM/YYYY");
    const time = dayjs(dateString).format("HH:mm");
    return [date, time].join(" ~ ");
  }
  return "";
};

/**
 * EN: Same input as `formatScheduleMovie`, but returns the date and time as
 * two separate fields instead of one joined string — used where a UI needs
 * to style/lay out the date and time independently.
 * VI: Đầu vào giống `formatScheduleMovie`, nhưng trả về ngày và giờ là hai
 * trường riêng biệt thay vì một chuỗi ghép — dùng khi UI cần style/bố cục
 * ngày và giờ độc lập với nhau.
 * @param dateString - EN: raw date string from the API. VI: chuỗi ngày thô từ API.
 * @returns EN: `{ date, time }` object, both "" if no date was given. VI: đối tượng `{ date, time }`, cả hai đều là "" nếu không có ngày.
 */
export const parseScheduleMovie = (dateString: string) => {
  if (!isEmpty(dateString)) {
    const date = dayjs(dateString).format("DD/MM/YYYY");
    const time = dayjs(dateString).format("HH:mm");
    return { date, time };
  }
  return { date: "", time: "" };
};

/**
 * EN: Locale-aware date formatter for display purposes — Vietnamese gets the
 * numeric "DD/MM/YYYY" convention, everything else falls back to the
 * English "MMM DD, YYYY" style. Returns the original string unchanged if
 * dayjs can't parse it, so callers never see "Invalid Date".
 * VI: Bộ định dạng ngày theo ngôn ngữ để hiển thị — tiếng Việt dùng kiểu số
 * "DD/MM/YYYY", các ngôn ngữ khác dùng kiểu tiếng Anh "MMM DD, YYYY". Trả về
 * nguyên chuỗi gốc nếu dayjs không parse được, để nơi gọi không bao giờ thấy
 * "Invalid Date".
 * @param dateString - EN: raw date string to format (optional). VI: chuỗi ngày cần định dạng (tùy chọn).
 * @param lang - EN: target language code, defaults to "vi". VI: mã ngôn ngữ đích, mặc định là "vi".
 * @returns EN: formatted date string, "" if no input, or the raw input if unparsable. VI: chuỗi ngày đã định dạng, "" nếu không có đầu vào, hoặc chuỗi gốc nếu không parse được.
 */
export const formatLocalizedDate = (dateString?: string, lang: string = "vi"): string => {
  if (isEmpty(dateString)) return "";
  const d = dayjs(dateString);
  if (!d.isValid()) return dateString as string;
  return lang === "vi" ? d.format("DD/MM/YYYY") : d.format("MMM DD, YYYY");
};

/**
 * EN: Trivial numeric addition helper. Left as plain arithmetic (not swapped
 * to lodash's `add`) because it's covered by `common.test.ts`, and this
 * refactor pass intentionally avoids touching logic under direct test
 * coverage to keep behavior guaranteed identical.
 * VI: Hàm cộng hai số đơn giản. Giữ nguyên phép cộng thuần (không đổi sang
 * `add` của lodash) vì hàm này được `common.test.ts` kiểm thử trực tiếp, và
 * đợt refactor này cố tình không đụng vào logic đang có test bao phủ để đảm
 * bảo hành vi giữ nguyên tuyệt đối.
 * @param numberOne - EN: first addend. VI: số hạng thứ nhất.
 * @param numberTwo - EN: second addend. VI: số hạng thứ hai.
 * @returns EN: the sum of both numbers. VI: tổng của hai số.
 */
export const sumTwoNumber = (numberOne: number, numberTwo: number): number => {
  let result = numberOne + numberTwo;
  return result;
};
