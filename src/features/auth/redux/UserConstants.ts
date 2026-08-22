// EN: Action type strings the login/register sagas `takeLatest` on. Kept as
// plain strings (not `createAction`) so pages can `dispatch({ type, payload })`
// directly without importing an action creator.
// VI: Chuỗi action type để các saga đăng nhập/đăng ký `takeLatest`. Giữ dạng
// chuỗi thuần (không dùng `createAction`) để các trang có thể
// `dispatch({ type, payload })` trực tiếp mà không cần import action creator.
export const USER_LOGIN_API = "USER_LOGIN_API";

export const USER_REGISTER_API = "USER_REGISTER_API";
