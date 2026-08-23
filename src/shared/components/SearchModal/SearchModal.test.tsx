import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import SearchModal from "./SearchModal";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, opts?: any) => opts?.defaultValue || _key,
    i18n: { language: "vi" },
  }),
}));

describe("SearchModal Component", () => {
  const mockOnClose = jest.fn();

  it("does not render modal content when open is false", () => {
    render(
      <BrowserRouter>
        <SearchModal open={false} onClose={mockOnClose} />
      </BrowserRouter>
    );

    expect(screen.queryByPlaceholderText(/Tìm kiếm tên phim/i)).not.toBeInTheDocument();
  });

  it("renders search input field when open is true", () => {
    render(
      <BrowserRouter>
        <SearchModal open={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Tìm kiếm tên phim/i)).toBeInTheDocument();
  });
});
