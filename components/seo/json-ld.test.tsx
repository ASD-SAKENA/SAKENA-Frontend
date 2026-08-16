import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "./json-ld";

describe("JsonLd", () => {
  it("renders a script tag with the correct type", () => {
    const { container } = render(<JsonLd data={{ "@type": "Organization" }} />);
    const script = container.querySelector("script");
    expect(script).toHaveAttribute("type", "application/ld+json");
  });

  it("serializes the given data as the script content", () => {
    const data = { name: "ساکنا", "@type": "Organization" };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector("script");
    expect(JSON.parse(script?.innerHTML ?? "{}")).toEqual(data);
  });
});
