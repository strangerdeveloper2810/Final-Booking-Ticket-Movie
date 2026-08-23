import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SearchModal from "./SearchModal";

jest.mock("@cinefix/api-client", () => ({
  useGetFilmListQuery: jest.fn(() => ({ data: [], isLoading: false })),
  useGetTMDBMovieSearchQuery: jest.fn(() => ({ data: [], isLoading: false })),
  getTMDBImageUrl: jest.fn(() => "http://image.url"),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => options?.defaultValue || key,
    i18n: { language: "vi" },
  }),
}));

describe("SearchModal Component", () => {
  it("does not render modal content when open is false", () => {
    render(
      <BrowserRouter>
        <SearchModal open={false} onClose={jest.fn()} />
      </BrowserRouter>
    );
    expect(screen.queryByPlaceholderText(/thoát/i)).not.toBeInTheDocument();
  });

  it("renders search input field when open is true", () => {
    render(
      <BrowserRouter>
        <SearchModal open={true} onClose={jest.fn()} />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/thoát/i)).toBeInTheDocument();
  });
});
