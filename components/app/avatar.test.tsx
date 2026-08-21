import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("shows the initial when no picture is set", () => {
    // Leaving the picture unset must change nothing about how a user looks.
    render(<Avatar initial="م" />);

    expect(screen.getByText("م")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("treats a null URL the same as no picture", () => {
    render(<Avatar src={null} initial="م" />);

    expect(screen.getByText("م")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows the picture when one is set", () => {
    render(<Avatar src="https://example.test/a.png" initial="م" alt="سارا" />);

    const image = screen.getByRole("img", { name: "سارا" });
    expect(image).toBeInTheDocument();
    expect(screen.queryByText("م")).not.toBeInTheDocument();
  });
});
