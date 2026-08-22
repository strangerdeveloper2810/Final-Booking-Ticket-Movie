import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./rootSaga";
import BannerReducerSaga from "features/home/redux/banner/BannerSaga.reducer";
import FilmListSagaReducer from "features/home/redux/filmList/FilmListSaga.reducer";
import ListCinemaSagaReducer from "features/home/redux/cinema/ListCinemaSaga.reducer";
import UserSagaReducer from "features/auth/redux/UserSaga.reducer";
import BookingTicketReducer from "features/booking/redux/BookingTicket.reducer";
import LoadingReducer from "shared/redux/loading/Loading.reducer";
import { movieApi } from "shared/services/movieApi";
import { tmdbApi } from "shared/services/tmdbApi";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    Banner: BannerReducerSaga,
    FlimList: FilmListSagaReducer,
    Loading: LoadingReducer,
    ListCinema: ListCinemaSagaReducer,
    UserSaga: UserSagaReducer,
    Booking: BookingTicketReducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [tmdbApi.reducerPath]: tmdbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      sagaMiddleware,
      movieApi.middleware,
      tmdbApi.middleware
    ),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
