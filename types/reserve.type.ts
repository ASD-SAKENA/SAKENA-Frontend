import type { StatusColor } from "@/types/app.type";

/** Key of a reservable shared facility (Persian label doubles as the key). */
export type FacilityKey = "سالن ورزش" | "استخر" | "سالن همایش" | "آلاچیق";

/** A reservable shared facility shown in the toolbar tabs. */
export interface Facility {
  key: FacilityKey;
  label: string;
  /** Material Symbol name (mapped by AppIcon). */
  icon: string;
}

/** A base (pre-seeded) booking for a facility on a given weekday. */
export interface Booking {
  /** Weekday index 0..6 (شنبه..جمعه). */
  day: number;
  /** Start half-hour slot 0..27 from START_HOUR. */
  start: number;
  /** Duration in half-hour slots. */
  dur: number;
  /** Reserver display name. */
  who: string;
}

/** A booking the current user created, scoped to a facility + week. */
export interface MyBooking {
  facility: FacilityKey;
  week: number;
  day: number;
  start: number;
  dur: number;
}

/** Composer modal state. */
export interface ComposerState {
  open: boolean;
  day: number;
  start: number;
  dur: number;
}

/** Click-and-drag selection state. */
export interface DragState {
  dragging: boolean;
  day: number;
  start: number;
  end: number;
}

/** Result of a reservation attempt. */
export interface ReserveResult {
  ok: boolean;
  conflict: boolean;
}

/** Color pair used to render other residents' booking blocks. */
export interface BlockPalette {
  color: StatusColor;
}
