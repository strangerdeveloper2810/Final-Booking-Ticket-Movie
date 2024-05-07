import _ from "lodash";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { delay, put, call, takeLatest } from "redux-saga/effects";
import { BookingTicketAction } from "../../reducer/BookingTicket.reducer";
import {
  GET_TICKET_API,
  GET_TICKET,
} from "../../constant/BookingTicketConstants";
import { http } from "util/setting";

function* getTicketApi(action: PayloadAction): SagaIterator {
  const params = {
    maLichChieu: _.get(action, "payload", ""),
  };

  try {
    let result = yield call(() =>
      http.get(`/api/QuanLyDatVe/LayDanhSachPhongVe`, { params })
    );

    if (_.get(result, "status", 200)) {
      yield put(
        BookingTicketAction.getDetailBookingTicket(
          _.get(result, "data.content", {})
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export function* actionGetTicketApi() {
  yield takeLatest(GET_TICKET_API, getTicketApi);
}
