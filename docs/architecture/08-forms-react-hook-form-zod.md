# 08. Forms: `react-hook-form` + `zod`

## What changed, and why it looks structurally different

This codebase migrated its two forms (`Login`, `Register`) from `formik` + `yup` to `react-hook-form` + `zod`. `formik`/`yup` are now entirely absent from `package.json` — this wasn't a partial migration, it's a full swap.

The **validation** side is a straightforward like-for-like swap — both `yup` and `zod` are schema-declaration libraries for describing "what a valid object looks like" and producing readable error messages when it doesn't:
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
`z.infer<typeof schema>` is the detail worth calling out for anyone new to zod: it derives a TypeScript type *from* the runtime schema, so the validation rules and the TS type can never quietly drift apart the way a hand-written `interface` next to a hand-written `yup` schema could.

## The real structural change: `Controller`, not `register()`

`react-hook-form`'s simplest API, `register("fieldName")`, spreads `name`/`onChange`/`onBlur`/`ref` props directly onto a native uncontrolled `<input>`. That's *not* what this codebase does anywhere — every single field in `Login.tsx` and `Register.tsx` uses the `Controller` render-prop wrapper instead:

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
**Why `Controller` is required here, specifically**: the input being rendered is antd's `<Input>`, not a native `<input>`. antd's form controls are *controlled* components with their own internal value/onChange contract — `register()`'s uncontrolled-ref-spreading model doesn't compose with that. `Controller` is `react-hook-form`'s official bridge for exactly this situation: it hands you a `field` object (`{ value, onChange, onBlur, name, ref }`) shaped to spread onto any controlled third-party component, while RHF still tracks that field's state internally. **This is the actual structural delta from the old `formik` shape**, not just "different function names" — `formik.getFieldProps(name)` could spread directly onto a native `<input>` because formik's own model is closer to uncontrolled-prop-spreading; once the inputs became antd components, that direct-spread approach stopped being an option regardless of which form library was used.

## `zodResolver` — bridging a schema library to RHF's validation contract

```typescript
resolver: zodResolver(loginSchema),
```
`react-hook-form` doesn't know about zod (or yup, or any other schema library) natively — a `resolver` is RHF's plug-in point for validation, and `@hookform/resolvers` ships pre-built adapters for the popular schema libraries. `zodResolver(schema)` runs the zod schema against the form's current values on submit (and on blur/change depending on RHF's configured validation mode) and translates zod's error format into the shape RHF expects for `formState.errors`.

## `Register.tsx`'s submit — assembling the API payload

```tsx
const formikBag = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema), defaultValues: { /* 5 fields */ } });

const onSubmit = (data: RegisterFormData) => {
  dispatch({ type: USER_REGISTER_API, payload: { ...data, maNhom: GROUP_ID } });
};
```
`maNhom` (the Cybersoft "data group" code) is a fixed constant, not a form field — it's spread onto the validated form data right before dispatch, not part of the zod schema at all. This is a reasonable, common pattern: don't model a field in the validation schema (or expose it in the UI) if the user never actually chooses its value.

## A real timing subtlety worth knowing

```tsx
formState: { errors, isSubmitting }
```
`isSubmitting` drives the antd submit `Button`'s `loading` prop. **`isSubmitting` only reflects the synchronous duration of the `handleSubmit`-wrapped `onSubmit` callback** — and this codebase's `onSubmit` just does a synchronous `dispatch({...})` (the actual API call happens later, inside a saga, asynchronously). That means `isSubmitting` flips back to `false` almost immediately, *not* when the saga's async login/register flow actually completes. If you're looking at this code expecting the submit button to stay in a loading state until the API call resolves, it won't — that would require a separate loading flag (e.g. reading a loading boolean out of Redux state, the way [doc 04](./04-redux-saga-rtk-query-state-management.md) discusses for other flows) wired to the button explicitly, which isn't currently done for these two forms.

## Summary: what to reach for building a new form in this codebase

1. Define a `zod` schema (colocated in a `schemas/` folder next to the feature, per `features/auth/schemas/auth.schema.ts`'s example) and derive its TS type with `z.infer`.
2. `useForm({ resolver: zodResolver(schema), defaultValues: {...} })`.
3. If your fields are antd components (which they should be, per [doc 07](./07-styling-tailwindcss-and-design-tokens.md)'s "use antd for anything interactive" guidance): wrap each in `Controller`, not `register()`.
4. Don't rely on `isSubmitting` as a proxy for "the actual async operation this form triggers is still in flight" unless your `onSubmit` itself awaits that operation — in a saga-driven flow, it doesn't.
