import type { StatusColor } from "@/types/app.type";

/** A reservable shared facility shown in the toolbar tabs. */
export interface Facility {
  /** Backend UUID. */
  id: string;
  label: string;
  /** Material Symbol name (mapped by AppIcon). */
  icon: string;
  /** Max concurrent bookings per time slot before it locks. */
  capacity: number;
}

/** A backend booking projected onto the weekly grid. */
export interface GridBooking {
  /** Backend booking UUID — used to cancel. */
  id: string;
  /** Weekday index 0..6 (شنبه..جمعه). */
  day: number;
  /** Start half-hour slot 0..27 from START_HOUR. */
  start: number;
  /** Duration in half-hour slots. */
  dur: number;
  /** Whether the current user made this booking. */
  mine: boolean;
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

/** Color pair used to render other residents' booking blocks. */
export interface BlockPalette {
  color: StatusColor;
}
