import { takeLatest } from "redux-saga/effects";
// import { all } from "redux-saga/effects";
// import * as userSaga from "./UserSaga/UserSaga";
// export function* rootSaga() {
//   yield all([userSaga.helloSaga()]);
// }

function* helloSaga() {
  console.log("Hello saga");
}

export default function* rootSaga() {
  yield takeLatest("", helloSaga);
}
