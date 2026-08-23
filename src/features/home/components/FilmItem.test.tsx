import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import FilmItem from "./FilmItem";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("FilmItem Component", () => {
  const mockFilm = {
    maPhim: 1282,
    tenPhim: "Lật Mặt 7: Một Điều Ước",
    biDanh: "lat-mat-7",
    trailer: "https://youtube.com",
    hinhAnh: "https://movienew.cybersoft.edu.vn/hinhanh/latmat7.jpg",
    moTa: "Bộ phim gia đình tình cảm xúc động",
    maNhom: "GP00",
    ngayKhoiChieu: "2024-04-26T00:00:00",
    danhGia: 9,
    hot: true,
    dangChieu: true,
    sapChieu: false,
  };

  it("renders film title, description, and rating correctly", () => {
    render(
      <BrowserRouter>
        <FilmItem filmItem={mockFilm} />
      </BrowserRouter>
    );

    expect(screen.getByText("Lật Mặt 7: Một Điều Ước")).toBeInTheDocument();
    expect(screen.getByText("Bộ phim gia đình tình cảm xúc động")).toBeInTheDocument();
    expect(screen.getByText("9/10")).toBeInTheDocument();
  });

  it("navigates to detail page on book now click", () => {
    render(
      <BrowserRouter>
        <FilmItem filmItem={mockFilm} />
      </BrowserRouter>
    );

    const button = screen.getByRole("button", { name: "home:bookNow" });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/detail/1282");
  });

  it("falls back to default placeholder image when poster load fails", () => {
    render(
      <BrowserRouter>
        <FilmItem filmItem={mockFilm} />
      </BrowserRouter>
    );

    const img = screen.getByAltText("Lật Mặt 7: Một Điều Ước") as HTMLImageElement;
    fireEvent.error(img);

    expect(img.src).toContain("picsum.photos");
  });
});
