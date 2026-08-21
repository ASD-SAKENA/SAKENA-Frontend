import type { StatusColor } from "@/types/app.type";

/** A facility's booking policy, projected onto the weekly grid. */
export interface FacilityRules {
  /** First hour of the day shown on the grid. */
  startHour: number;
  /** Closing hour (exclusive). */
  endHour: number;
  /** Half-hour rows between `startHour` and `endHour`. */
  slots: number;
  /** Weekday indexes the facility is closed on (0 = شنبه … 6 = جمعه). */
  closedDays: number[];
  /** Shortest / longest booking, in half-hour rows. */
  minSlots: number;
  maxSlots: number;
  /** How many days ahead a resident may book. */
  maxAdvanceDays: number;
  /** Bookings one resident may hold per week; 0 means unlimited. */
  maxPerWeek: number;
  /** Toman per hour; 0 means the facility is free. */
  hourlyPrice: number;
}

/** A reservable shared facility shown in the toolbar tabs. */
export interface Facility {
  /** Backend UUID. */
  id: string;
  label: string;
  /** Material Symbol name (mapped by AppIcon). */
  icon: string;
  /** Max concurrent bookings per time slot before it locks. */
  capacity: number;
  rules: FacilityRules;
}

/** One of the current resident's upcoming reservations. */
export interface MyBooking {
  id: string;
  facilityId: string;
  facilityLabel: string;
  facilityIcon: string;
  startsAt: Date;
  endsAt: Date;
  partySize: number;
  price: number;
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
  /** People this booking brings — capacity is measured in people. */
  partySize: number;
  /** What the booking cost, so the details modal can name the refund. */
  price: number;
  /** Absolute times, for showing details and deciding if the session started. */
  startsAt: Date;
  endsAt: Date;
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
