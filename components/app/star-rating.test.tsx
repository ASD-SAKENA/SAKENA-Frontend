import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StarRating } from "./star-rating";

describe("StarRating", () => {
  it("renders five stars", () => {
    render(<StarRating value={0} onChange={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("calls onChange with the clicked star's value", () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);

    fireEvent.click(screen.getAllByRole("button")[2]);

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("is not interactive when readOnly", () => {
    const onChange = vi.fn();
    render(<StarRating value={4} onChange={onChange} readOnly />);

    fireEvent.click(screen.getAllByRole("img")[0] ?? document.body);

    expect(onChange).not.toHaveBeenCalled();
  });
});
