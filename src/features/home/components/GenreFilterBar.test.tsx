import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GenreFilterBar from "./GenreFilterBar";

describe("GenreFilterBar Component", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it("renders genre pills including All and specific genres", () => {
    render(<GenreFilterBar selectedGenre="all" onSelectGenre={mockOnSelect} />);

    expect(screen.getByText(/Tất Cả/i)).toBeInTheDocument();
    expect(screen.getByText(/Hành Động/i)).toBeInTheDocument();
    expect(screen.getByText(/Hài Hước/i)).toBeInTheDocument();
  });

  it("calls onSelectGenre when a genre pill is clicked", () => {
    render(<GenreFilterBar selectedGenre="all" onSelectGenre={mockOnSelect} />);

    const actionButton = screen.getByText(/Hành Động/i);
    fireEvent.click(actionButton);

    expect(mockOnSelect).toHaveBeenCalledWith("ACTION");
  });
});
