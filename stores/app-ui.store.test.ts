import { beforeEach, describe, expect, it } from "vitest";

import { useAppUiStore } from "./app-ui.store";

describe("useAppUiStore", () => {
  beforeEach(() => {
    useAppUiStore.setState({ navOpen: false, requestModalOpen: false });
  });

  it("opens and closes the nav drawer", () => {
    useAppUiStore.getState().openNav();
    expect(useAppUiStore.getState().navOpen).toBe(true);

    useAppUiStore.getState().closeNav();
    expect(useAppUiStore.getState().navOpen).toBe(false);
  });

  it("opens and closes the request modal independently of the nav drawer", () => {
    useAppUiStore.getState().openRequestModal();
    expect(useAppUiStore.getState().requestModalOpen).toBe(true);
    expect(useAppUiStore.getState().navOpen).toBe(false);

    useAppUiStore.getState().closeRequestModal();
    expect(useAppUiStore.getState().requestModalOpen).toBe(false);
  });
});
