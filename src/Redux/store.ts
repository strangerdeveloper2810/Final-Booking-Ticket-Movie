import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./saga/rootSaga";
import BannerReducerSaga from "./reducer/BannerSaga.reducer";
import FilmListSagaReducer from "./reducer/FilmListSaga.reducer";
import LoadingReducer from "./reducer/Loading.reducer";
import ListCinemaSagaReducer from "./reducer/ListCinemaSaga.reducer";
import UserSagaReducer from "./reducer/UserSaga.reducer";
import BookingTicketReducer from "./reducer/BookingTicket.reducer";
const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    Banner: BannerReducerSaga,
    FlimList: FilmListSagaReducer,
    Loading: LoadingReducer,
    ListCinema: ListCinemaSagaReducer,
    UserSaga: UserSagaReducer,
    Booking: BookingTicketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
