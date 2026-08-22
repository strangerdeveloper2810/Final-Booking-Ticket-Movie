import { z } from "zod";

// EN: Validation lives here (zod) rather than in lodash — zod's schema/
// resolver API is unrelated to lodash's array/object helpers, so it is
// intentionally left as-is by this refactor. `react-hook-form`'s
// `zodResolver` (used in Login.tsx/Register.tsx) reads these schemas to
// produce the `errors` object shown under each field.
// VI: Việc validate nằm ở đây (zod) chứ không dùng lodash — API schema/
// resolver của zod không liên quan tới các hàm tiện ích mảng/object của
// lodash, nên được giữ nguyên trong lần refactor này. `zodResolver` của
// `react-hook-form` (dùng trong Login.tsx/Register.tsx) đọc các schema này
// để tạo ra object `errors` hiển thị dưới mỗi trường nhập liệu.

/**
 * EN: Validation rules for the login form; error messages are in Vietnamese
 * since that's the app's primary user-facing language.
 * VI: Quy tắc kiểm tra dữ liệu cho form đăng nhập; thông báo lỗi bằng tiếng
 * Việt vì đây là ngôn ngữ chính hiển thị cho người dùng.
 */
export const loginSchema = z.object({
  taiKhoan: z.string().min(1, "Vui lòng nhập tài khoản!"),
  matKhau: z.string().min(1, "Vui lòng nhập mật khẩu!"),
});

/**
 * EN: Validation rules for the register form. Note `matKhau` requires a
 * minimum of 6 characters here (stricter than the login schema's "just
 * non-empty"), matching the Cybersoft API's password policy for new
 * accounts.
 * VI: Quy tắc kiểm tra dữ liệu cho form đăng ký. Lưu ý `matKhau` yêu cầu tối
 * thiểu 6 ký tự (chặt hơn so với schema đăng nhập chỉ yêu cầu "không được
 * để trống"), khớp với chính sách mật khẩu của API Cybersoft cho tài khoản
 * mới.
 */
export const registerSchema = z.object({
  taiKhoan: z.string().min(1, "Vui lòng nhập tài khoản!"),
  matKhau: z.string().min(6, "Mật khẩu phải chứa ít nhất 6 ký tự!"),
  hoTen: z.string().min(1, "Vui lòng nhập họ và tên!"),
  email: z.string().min(1, "Vui lòng nhập email!").email("Email không đúng định dạng!"),
  soDt: z.string().min(1, "Vui lòng nhập số điện thoại!"),
});

// EN: Types inferred directly from the zod schemas so form values and
// validation rules can never drift apart.
// VI: Kiểu dữ liệu được suy ra trực tiếp từ schema zod để giá trị form và
// quy tắc kiểm tra luôn đồng bộ với nhau.
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
