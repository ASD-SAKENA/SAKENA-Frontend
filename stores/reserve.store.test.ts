import { beforeEach, describe, expect, it } from "vitest";

import { useReserveStore } from "./reserve.store";

const INITIAL = {
  selFacilityId: null,
  weekOffset: 0,
  composer: { open: false, day: 0, start: 0, dur: 2 },
  drag: { dragging: false, day: 0, start: 0, end: 0 },
  justDragged: false,
};

describe("useReserveStore", () => {
  beforeEach(() => {
    useReserveStore.setState(INITIAL);
  });

  it("sets the selected facility", () => {
    useReserveStore.getState().setFacility("facility-1");
    expect(useReserveStore.getState().selFacilityId).toBe("facility-1");
  });

  it("navigates weeks forward, backward, and back to the current week", () => {
    const { nextWeek, prevWeek, thisWeek } = useReserveStore.getState();
    nextWeek();
    nextWeek();
    expect(useReserveStore.getState().weekOffset).toBe(2);
    prevWeek();
    expect(useReserveStore.getState().weekOffset).toBe(1);
    thisWeek();
    expect(useReserveStore.getState().weekOffset).toBe(0);
  });

  it("opens the composer with a default duration of 2 slots", () => {
    useReserveStore.getState().openComposer(1, 4);
    expect(useReserveStore.getState().composer).toEqual({
      open: true,
      day: 1,
      start: 4,
      dur: 2,
    });
  });

  it("opens the composer with an explicit duration", () => {
    useReserveStore.getState().openComposer(1, 4, 5);
    expect(useReserveStore.getState().composer.dur).toBe(5);
  });

  it("closes the composer without losing its day/start/dur", () => {
    useReserveStore.getState().openComposer(2, 6, 3);
    useReserveStore.getState().closeComposer();
    expect(useReserveStore.getState().composer).toEqual({
      open: false,
      day: 2,
      start: 6,
      dur: 3,
    });
  });

  it("setDur only changes the composer's duration", () => {
    useReserveStore.getState().openComposer(1, 4);
    useReserveStore.getState().setDur(6);
    expect(useReserveStore.getState().composer).toEqual({
      open: true,
      day: 1,
      start: 4,
      dur: 6,
    });
  });

  describe("drag selection", () => {
    it("starts a drag at a single slot", () => {
      useReserveStore.getState().startDrag(0, 3);
      expect(useReserveStore.getState().drag).toEqual({
        dragging: true,
        day: 0,
        start: 3,
        end: 3,
      });
    });

    it("extends the drag end on the same day", () => {
      useReserveStore.getState().startDrag(0, 3);
      useReserveStore.getState().dragTo(0, 6);
      expect(useReserveStore.getState().drag.end).toBe(6);
    });

    it("ignores a drag-to on a different day", () => {
      useReserveStore.getState().startDrag(0, 3);
      useReserveStore.getState().dragTo(1, 6);
      expect(useReserveStore.getState().drag.day).toBe(0);
      expect(useReserveStore.getState().drag.end).toBe(3);
    });

    it("ignores dragTo when not currently dragging", () => {
      useReserveStore.getState().dragTo(0, 6);
      expect(useReserveStore.getState().drag.dragging).toBe(false);
    });

    it("endDrag opens the composer spanning the dragged range", () => {
      useReserveStore.getState().startDrag(2, 3);
      useReserveStore.getState().dragTo(2, 5);
      useReserveStore.getState().endDrag();

      const state = useReserveStore.getState();
      expect(state.drag.dragging).toBe(false);
      expect(state.composer).toEqual({ open: true, day: 2, start: 3, dur: 3 });
      expect(state.justDragged).toBe(true);
    });

    it("endDrag does nothing (no composer) for a single-slot drag", () => {
      useReserveStore.getState().startDrag(2, 3);
      useReserveStore.getState().endDrag();

      const state = useReserveStore.getState();
      expect(state.composer.open).toBe(false);
      expect(state.justDragged).toBe(false);
    });

    it("endDrag is a no-op when not dragging", () => {
      useReserveStore.getState().endDrag();
      expect(useReserveStore.getState().drag.dragging).toBe(false);
    });
  });

  describe("consumeJustDragged", () => {
    it("returns true once and clears the flag", () => {
      useReserveStore.setState({ justDragged: true });
      expect(useReserveStore.getState().consumeJustDragged()).toBe(true);
      expect(useReserveStore.getState().justDragged).toBe(false);
      expect(useReserveStore.getState().consumeJustDragged()).toBe(false);
    });
  });
});
