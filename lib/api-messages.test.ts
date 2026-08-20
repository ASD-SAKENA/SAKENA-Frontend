import { describe, expect, it } from "vitest";

import { toPersianApiMessage } from "./api-messages";

describe("toPersianApiMessage", () => {
  it("translates the occupied-unit conflict, unit number and all", () => {
    const translated = toPersianApiMessage(
      "Unit 12 already has a current resident; end that residency before inviting a new one",
    );

    expect(translated).toContain("این واحد در حال حاضر ساکن دارد");
    expect(translated).not.toMatch(/[a-z]/i);
  });

  it("translates the resident-already-housed conflict", () => {
    expect(
      toPersianApiMessage("This resident already occupies another unit"),
    ).toContain("ساکن واحد دیگری است");
  });

  it("translates the non-resident join refusal", () => {
    expect(
      toPersianApiMessage(
        "A manager account cannot move into a unit; join with a resident account instead",
      ),
    ).toContain("واحد فقط به حساب ساکن");
  });

  it("keeps an unrecognised message as-is rather than hiding it", () => {
    const unknown = "Something the frontend has no wording for yet";
    expect(toPersianApiMessage(unknown)).toBe(unknown);
  });
});
