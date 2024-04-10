import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./saga/rootSaga";
import BannerReducerSaga from "./reducer/BannerSagaReducer";
import FilmListSagaReducer from "./reducer/FilmListSagaReducer";
import LoadingReducer from "./reducer/LoadingReducer";
import ListCinemaSagaReducer from "./reducer/ListCinemaSagaReducer";
import UserSagaReducer from "./reducer/UserSagaReducer";
import FilmDetailReducer from "./reducer/FilmDetailReducer"
const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    BannerSaga: BannerReducerSaga,
    FlimListSaga: FilmListSagaReducer,
    Loading: LoadingReducer,
    ListCinema: ListCinemaSagaReducer,
    UserSaga: UserSagaReducer,
    FilmDetail:FilmDetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
