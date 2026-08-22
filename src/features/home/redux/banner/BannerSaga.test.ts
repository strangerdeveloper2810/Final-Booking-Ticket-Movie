import { put } from "redux-saga/effects";
import { getAllBannerApi } from "./BannerSaga";
import { BannerSagaAction } from "./BannerSaga.reducer";
import { Banner } from "./BannerType";

const initialBanner: Banner[] = [
  {
    maBanner: 1,
    maPhim: 1282,
    hinhAnh: "https://movienew.cybersoft.edu.vn/hinhanh/ban-tay-diet-quy.png",
  },
  {
    maBanner: 2,
    maPhim: 1283,
    hinhAnh: "https://movienew.cybersoft.edu.vn/hinhanh/lat-mat-48h.png",
  },
  {
    maBanner: 3,
    maPhim: 1284,
    hinhAnh: "https://movienew.cybersoft.edu.vn/hinhanh/cuoc-chien-sinh-tu.png",
  },
];

describe("getAllBannerApi Saga", () => {
  it("should dispatch action with data when API returns data", () => {
    const generator = getAllBannerApi();

    const effect = generator.next().value;
    expect(effect).toMatchObject({
      type: "CALL",
      payload: {
        fn: expect.any(Function),
        args: [],
      },
    });

    expect(generator.next(initialBanner).value).toEqual(
      put(BannerSagaAction.getAllBanner(initialBanner))
    );

    expect(generator.next().done).toBe(true);
  });

  it("should dispatch action with empty array when API returns empty", () => {
    const generator = getAllBannerApi();

    const effect = generator.next().value;
    expect(effect).toMatchObject({
      type: "CALL",
      payload: {
        fn: expect.any(Function),
        args: [],
      },
    });

    expect(generator.next([]).value).toEqual(
      put(BannerSagaAction.getAllBanner([]))
    );

    expect(generator.next().done).toBe(true);
  });
});
