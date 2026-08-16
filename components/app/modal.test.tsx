import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./modal";

describe("Modal", () => {
  it("renders nothing visible when closed", () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="عنوان">
        <p>محتوا</p>
      </Modal>,
    );
    expect(screen.queryByText("عنوان")).not.toBeInTheDocument();
  });

  it("renders the title, description and children when open", () => {
    render(
      <Modal open onClose={vi.fn()} title="عنوان مودال" description="توضیحات">
        <p>محتوای مودال</p>
      </Modal>,
    );
    expect(screen.getByText("عنوان مودال")).toBeInTheDocument();
    expect(screen.getByText("توضیحات")).toBeInTheDocument();
    expect(screen.getByText("محتوای مودال")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose} title="عنوان">
        <p>محتوا</p>
      </Modal>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render an icon chip when no icon is given", () => {
    // Dialog content renders in a portal, so query the full document.
    render(
      <Modal open onClose={vi.fn()} title="عنوان">
        <p>محتوا</p>
      </Modal>,
    );
    expect(document.querySelectorAll("svg").length).toBe(1); // just the close icon
  });
});
