"use client";

import { toast } from "sonner";

import { LOCALE } from "@/app/config";

import { AppIcon } from "@/components/app/app-icon";

import {
  useCancelBookingMutation,
  useMyBookingsQuery,
} from "@/queries/reserve";

import { formatToman, toFaDigits } from "@/lib/persian-number";

import type { MyBooking } from "@/types/reserve.type";

function timeRange(booking: MyBooking): string {
  const time = (date: Date) =>
    date.toLocaleTimeString(LOCALE, { hour: "2-digit", minute: "2-digit" });
  const day = booking.startsAt.toLocaleDateString(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return `${day} · ${time(booking.startsAt)} – ${time(booking.endsAt)}`;
}

/** The resident's own upcoming reservations across every facility. */
export function MyBookingsPanel() {
  const { data: bookings = [], isLoading } = useMyBookingsQuery();
  const cancelBooking = useCancelBookingMutation();

  if (isLoading || bookings.length === 0) return null;

  const handleCancel = (booking: MyBooking) => {
    if (cancelBooking.isPending) return;
    cancelBooking.mutate(
      { facilityId: booking.facilityId, bookingId: booking.id },
      { onSuccess: () => toast.success("رزرو شما لغو شد") },
    );
  };

  return (
    <section className="mb-[14px] rounded-2xl border border-app-border bg-app-surface p-4 shadow-[var(--ap-shadow-sm)]">
      <h2 className="mb-3 flex items-center gap-2 text-[14px] font-bold">
        <AppIcon name="event_available" className="size-[19px] text-app-gold" />
        رزروهای پیش‌روی شما
        <span className="text-[12px] font-normal text-app-muted">
          ({toFaDigits(bookings.length)} مورد)
        </span>
      </h2>

      <ul className="flex flex-col gap-2">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-app-border bg-app-surface2 px-3.5 py-2.5"
          >
            <AppIcon
              name={booking.facilityIcon}
              className="size-5 text-app-steel"
            />
            <span className="text-[13.5px] font-semibold">
              {booking.facilityLabel}
            </span>
            <span className="text-[12.5px] text-app-muted">
              {timeRange(booking)}
            </span>
            <span className="mr-auto text-[12.5px] font-semibold text-app-gold">
              {booking.price > 0 ? formatToman(booking.price) : "رایگان"}
            </span>
            <button
              type="button"
              onClick={() => handleCancel(booking)}
              className="text-[12.5px] font-semibold text-app-danger"
            >
              لغو رزرو
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
