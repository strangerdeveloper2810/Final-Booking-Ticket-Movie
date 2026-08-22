# 08. Biểu mẫu (Forms): `react-hook-form` + `zod`

## Điều gì đã thay đổi, và tại sao nó trông khác biệt về mặt cấu trúc

Codebase này đã di chuyển hai form (`Login`, `Register`) từ `formik` + `yup` sang `react-hook-form` + `zod`. `formik`/`yup` giờ đây hoàn toàn không còn xuất hiện trong `package.json` — đây không phải là một cuộc di chuyển từng phần, mà là một sự thay thế toàn diện.

Phần **validation** là một sự thay thế trực tiếp, tương đương nhau — cả `yup` và `zod` đều là các thư viện khai báo schema (schema-declaration) dùng để mô tả "một đối tượng hợp lệ trông như thế nào" và tạo ra các thông báo lỗi dễ đọc khi đối tượng đó không hợp lệ:
```typescript
// src/features/auth/schemas/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  taiKhoan: z.string().min(1, "Vui lòng nhập tài khoản!"),
  matKhau: z.string().min(1, "Vui lòng nhập mật khẩu!"),
});

export const registerSchema = z.object({
  taiKhoan: z.string().min(1, "Vui lòng nhập tài khoản!"),
  matKhau: z.string().min(6, "Mật khẩu phải chứa ít nhất 6 ký tự!"),
  hoTen: z.string().min(1, "Vui lòng nhập họ và tên!"),
  email: z.string().min(1, "Vui lòng nhập email!").email("Email không đúng định dạng!"),
  soDt: z.string().min(1, "Vui lòng nhập số điện thoại!"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
```
`z.infer<typeof schema>` là chi tiết đáng chú ý đối với bất kỳ ai mới làm quen với zod: nó suy ra (derives) một kiểu TypeScript *từ* schema runtime, vì vậy các quy tắc validation và kiểu TS không bao giờ có thể âm thầm lệch nhau theo cách mà một `interface` viết tay đặt cạnh một schema `yup` viết tay có thể xảy ra.

## Thay đổi cấu trúc thực sự: `Controller`, không phải `register()`

API đơn giản nhất của `react-hook-form`, `register("fieldName")`, trải (spread) các prop `name`/`onChange`/`onBlur`/`ref` trực tiếp lên một `<input>` gốc (native) không được kiểm soát (uncontrolled). Đó *không* phải là cách codebase này làm ở bất kỳ đâu — mọi field trong `Login.tsx` và `Register.tsx` đều sử dụng wrapper render-prop `Controller` thay vào đó:

```tsx
// src/features/auth/pages/Login.tsx
const {
  control,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: { taiKhoan: "", matKhau: "" },
});

// ...

<Controller
  name="taiKhoan"
  control={control}
  render={({ field }) => (
    <Input
      {...field}
      size="large"
      prefix={<UserOutlined className="text-text-secondary" />}
      placeholder={t("auth:accountPlaceholder")}
      status={errors.taiKhoan ? "error" : ""}
      className="bg-background text-text-primary border-border hover:border-primary focus:border-primary"
    />
  )}
/>
{errors.taiKhoan && <p className="text-xs text-red-500 mt-1">{errors.taiKhoan.message}</p>}
```
**Tại sao `Controller` lại cần thiết ở đây, cụ thể là**: input được render là `<Input>` của antd, không phải một `<input>` gốc. Các form control của antd là các component *controlled* (được kiểm soát) với hợp đồng value/onChange nội bộ riêng của chúng — mô hình trải ref không kiểm soát (uncontrolled-ref-spreading) của `register()` không thể kết hợp với điều đó. `Controller` chính là cầu nối chính thức của `react-hook-form` cho đúng tình huống này: nó cung cấp cho bạn một đối tượng `field` (`{ value, onChange, onBlur, name, ref }`) được thiết kế để trải lên bất kỳ component controlled bên thứ ba nào, trong khi RHF vẫn theo dõi trạng thái (state) của field đó ở bên trong. **Đây mới là sự khác biệt cấu trúc thực sự so với hình thái `formik` cũ**, chứ không chỉ đơn thuần là "tên hàm khác nhau" — `formik.getFieldProps(name)` có thể trải trực tiếp lên một `<input>` gốc vì bản thân mô hình của formik gần với cách trải prop không kiểm soát hơn; một khi các input trở thành component của antd, cách tiếp cận trải trực tiếp đó không còn là một lựa chọn nữa, bất kể sử dụng thư viện form nào.

## `zodResolver` — cầu nối giữa một thư viện schema và hợp đồng validation của RHF

```typescript
resolver: zodResolver(loginSchema),
```
`react-hook-form` vốn không biết gì về zod (hay yup, hay bất kỳ thư viện schema nào khác) — `resolver` là điểm cắm (plug-in point) của RHF dành cho validation, và `@hookform/resolvers` cung cấp sẵn các adapter dựng sẵn cho các thư viện schema phổ biến. `zodResolver(schema)` chạy schema zod đối chiếu với các giá trị hiện tại của form khi submit (và khi blur/change tùy theo chế độ validation mà RHF được cấu hình) rồi chuyển đổi định dạng lỗi của zod sang hình dạng mà RHF mong đợi cho `formState.errors`.

## Submit của `Register.tsx` — lắp ráp payload cho API

```tsx
const formikBag = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema), defaultValues: { /* 5 fields */ } });

const onSubmit = (data: RegisterFormData) => {
  dispatch({ type: USER_REGISTER_API, payload: { ...data, maNhom: GROUP_ID } });
};
```
`maNhom` (mã "nhóm dữ liệu" của Cybersoft) là một hằng số cố định, không phải một field của form — nó được trải lên dữ liệu form đã được validate ngay trước khi dispatch, hoàn toàn không phải là một phần của schema zod. Đây là một pattern hợp lý và phổ biến: đừng mô hình hóa một field trong schema validation (hoặc hiển thị nó trên UI) nếu người dùng không bao giờ thực sự chọn giá trị của field đó.

## Một điểm tinh tế thực sự về thời điểm (timing) đáng lưu ý

```tsx
formState: { errors, isSubmitting }
```
`isSubmitting` điều khiển prop `loading` của `Button` submit trong antd. **`isSubmitting` chỉ phản ánh khoảng thời gian đồng bộ (synchronous) của callback `onSubmit` được `handleSubmit` bọc lại** — và `onSubmit` của codebase này chỉ thực hiện một `dispatch({...})` đồng bộ (lệnh gọi API thực sự diễn ra sau đó, bên trong một saga, một cách bất đồng bộ). Điều đó có nghĩa là `isSubmitting` chuyển trở lại `false` gần như ngay lập tức, *chứ không phải* khi luồng login/register bất đồng bộ của saga thực sự hoàn tất. Nếu bạn nhìn vào đoạn code này và kỳ vọng nút submit sẽ duy trì trạng thái loading cho đến khi lệnh gọi API hoàn tất, điều đó sẽ không xảy ra — việc đó đòi hỏi một cờ (flag) loading riêng biệt (ví dụ: đọc một boolean loading từ Redux state, theo cách mà [doc 04](./04-redux-saga-rtk-query-state-management.md) đã bàn đến cho các luồng khác) được gắn tường minh vào nút bấm, điều mà hiện tại chưa được thực hiện cho hai form này.

## Tóm tắt: nên dùng gì khi xây dựng một form mới trong codebase này

1. Định nghĩa một schema `zod` (đặt cùng vị trí trong một thư mục `schemas/` cạnh feature, theo ví dụ của `features/auth/schemas/auth.schema.ts`) và suy ra kiểu TS của nó bằng `z.infer`.
2. `useForm({ resolver: zodResolver(schema), defaultValues: {...} })`.
3. Nếu các field của bạn là component antd (và chúng nên là như vậy, theo hướng dẫn "dùng antd cho mọi thứ có tính tương tác" của [doc 07](./07-styling-tailwindcss-and-design-tokens.md)): hãy bọc mỗi field trong `Controller`, không phải `register()`.
4. Đừng dựa vào `isSubmitting` như một đại diện cho "thao tác bất đồng bộ thực sự mà form này kích hoạt vẫn đang diễn ra" trừ khi chính `onSubmit` của bạn await thao tác đó — trong một luồng do saga điều khiển, nó không làm vậy.
