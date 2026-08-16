import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AppField, AppInput, AppSelect, AppTextarea } from "./form-controls";

describe("AppField", () => {
  it("renders the label, children and error", () => {
    render(
      <AppField label="نام" error="این فیلد الزامی است">
        <input />
      </AppField>,
    );
    expect(screen.getByText("نام")).toBeInTheDocument();
    expect(screen.getByText("این فیلد الزامی است")).toBeInTheDocument();
  });

  it("omits the label and error when not given", () => {
    render(
      <AppField>
        <input />
      </AppField>,
    );
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });
});

describe("AppInput", () => {
  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<AppInput placeholder="نام کاربری" />);
    const input = screen.getByPlaceholderText("نام کاربری");
    await user.type(input, "moeein");
    expect(input).toHaveValue("moeein");
  });

  it("renders an icon when given", () => {
    const { container } = render(<AppInput icon="person" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders no icon wrapper when not given", () => {
    const { container } = render(<AppInput />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});

describe("AppSelect", () => {
  it("renders its option children and responds to selection", async () => {
    const user = userEvent.setup();
    render(
      <AppSelect defaultValue="a">
        <option value="a">الف</option>
        <option value="b">ب</option>
      </AppSelect>,
    );
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "b");
    expect(select).toHaveValue("b");
  });
});

describe("AppTextarea", () => {
  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<AppTextarea placeholder="توضیحات" />);
    const textarea = screen.getByPlaceholderText("توضیحات");
    await user.type(textarea, "متن آزمایشی");
    expect(textarea).toHaveValue("متن آزمایشی");
  });
});
