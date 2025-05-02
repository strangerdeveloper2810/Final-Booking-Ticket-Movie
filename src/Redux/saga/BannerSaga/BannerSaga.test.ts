import { call, put } from "redux-saga/effects";
import { getAllBannerApi } from "./BannerSaga";
import { BannerSagaAction } from "../../reducer/BannerSaga.reducer";
import { Banner } from "../../types/BannerType";

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
        const generator = getAllBannerApi(); // Khởi tạo saga dưới dạng generator

        // Step 1: Saga yield ra call effect
        const effect = generator.next().value;
        expect(effect).toMatchObject({
            type: "CALL",                         // Đây là effect call(...)
            payload: {
                fn: expect.any(Function),         // Vì bạn dùng arrow function nên đây là anonymous fn
                args: [],                         // Không có tham số truyền vào
            },
        });

        // Step 2: Giả lập response có data, saga sẽ yield ra put(...)
        expect(generator.next(initialBanner).value).toEqual(
            put(BannerSagaAction.getAllBanner(initialBanner))
        );

        // Step 3: Saga hoàn tất
        expect(generator.next().done).toBe(true);
    });


    it("should dispatch action with empty array when API returns empty", () => {
        const generator = getAllBannerApi();

        // Step 1: call effect
        const effect = generator.next().value;
        expect(effect).toMatchObject({
            type: "CALL",
            payload: {
                fn: expect.any(Function),
                args: [],
            },
        });

        // Step 2: giả lập API trả về [] → saga sẽ dispatch put([]) luôn
        expect(generator.next([]).value).toEqual(
            put(BannerSagaAction.getAllBanner([]))
        );

        // Step 3: Saga hoàn tất
        expect(generator.next().done).toBe(true);
    });


    // it("should handle error and not crash", () => {
    //     const generator = getAllBannerApi();

    //     const effect = generator.next().value;
    //     expect(effect).toMatchObject({
    //         type: "CALL",
    //         payload: {
    //             fn: expect.any(Function),
    //             args: [],
    //         },
    //     });

    //     const error = new Error("Network Error");
    //     generator.throw(error);

    //     expect(generator.next().done).toBe(true);
    // });
});
