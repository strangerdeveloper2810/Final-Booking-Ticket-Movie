import { takeLatest } from "redux-saga/effects";
function* sayHello() {
  yield console.log("Hello Saga");
}

export function* helloSaga() {
  yield takeLatest("", sayHello);
}
