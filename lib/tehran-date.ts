const TEHRAN_TZ = "Asia/Tehran";

function getTehranParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TEHRAN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "0";

  return {
    year: Number.parseInt(get("year"), 10),
    month: Number.parseInt(get("month"), 10),
    day: Number.parseInt(get("day"), 10),
    hour: Number.parseInt(get("hour"), 10),
  };
}

export function getTehranGregorianParts(date = new Date()) {
  return getTehranParts(date);
}

/** Gregorian YYYY-MM-DD in Asia/Tehran. */
export function getTehranTodayIso(date = new Date()): string {
  const { year, month, day } = getTehranParts(date);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/** Alias for dedup keys — same as Tehran today ISO. */
export function getTehranDateKey(date = new Date()): string {
  return getTehranTodayIso(date);
}

/** Current 3-hour poll slot rounded down (00:00 … 21:00). */
export function getTehranPollSlot(date = new Date()): string {
  const { hour } = getTehranParts(date);
  const slotHour = Math.floor(hour / 3) * 3;
  return `${String(slotHour).padStart(2, "0")}:00`;
}
