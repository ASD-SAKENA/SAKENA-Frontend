"use client";

import { toast } from "sonner";

import { LOCALE } from "@/app/config";

import { AppButton } from "@/components/app/app-button";
import { AppIcon } from "@/components/app/app-icon";
import { Modal } from "@/components/app/modal";

import { useCancelBookingMutation } from "@/queries/reserve";

import { formatToman, toFaDigits } from "@/lib/persian-number";
import { hasSessionStarted } from "@/lib/reserve-time";

import type { GridBooking } from "@/types/reserve.type";

interface Props {
  booking: GridBooking | null;
  facilityId: string;
  facilityLabel: string;
  /** Managers may cancel any booking; a resident only their own. */
  canCancel: boolean;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-app-border py-[11px] last:border-b-0">
      <span className="text-[13px] text-app-muted">{label}</span>
      <span className="text-[13.5px] font-semibold">{value}</span>
    </div>
  );
}

export function BookingDetailsModal({
  booking,
  facilityId,
  facilityLabel,
  canCancel,
  onClose,
}: Props) {
  const cancelBooking = useCancelBookingMutation();

  const started = booking !== null && hasSessionStarted(booking.startsAt);

  const handleCancel = () => {
    if (!booking || cancelBooking.isPending) return;
    cancelBooking.mutate(
      { facilityId, bookingId: booking.id },
      {
        onSuccess: () => {
          toast.success(
            booking.price > 0
              ? "رزرو لغو شد و مبلغ به کیف پول ساکن بازگشت"
              : "رزرو لغو شد",
          );
          onClose();
        },
      },
    );
  };

  const time = (date: Date) =>
    date.toLocaleTimeString(LOCALE, { hour: "2-digit", minute: "2-digit" });

  return (
    <Modal
      open={booking !== null}
      onClose={onClose}
      title="جزئیات رزرو"
      description={facilityLabel}
      icon="event"
    >
      {booking ? (
        <div className="mt-4">
          <Row
            label="تاریخ"
            value={booking.startsAt.toLocaleDateString(LOCALE, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          />
          <Row
            label="ساعت"
            value={`${time(booking.startsAt)} – ${time(booking.endsAt)}`}
          />
          <Row
            label="تعداد نفرات"
            value={`${toFaDigits(booking.partySize)} نفر`}
          />
          <Row
            label="مبلغ پرداخت‌شده"
            value={booking.price > 0 ? formatToman(booking.price) : "رایگان"}
          />
          <Row
            label="رزرو‌کننده"
            value={booking.mine ? "شما" : "ساکن ساختمان"}
          />

          {started ? (
            <div className="mt-4 flex items-center gap-[9px] rounded-[11px] border border-app-border bg-app-surface2 px-[14px] py-[11px]">
              <AppIcon name="info" className="size-5 text-app-steel" />
              <span className="text-[13px] text-app-muted">
                سانس شروع شده است و امکان لغو رزرو وجود ندارد.
              </span>
            </div>
          ) : canCancel ? (
            <div className="mt-4">
              {booking.price > 0 ? (
                <p className="mb-2.5 text-[12.5px] text-app-muted">
                  با لغو رزرو، {formatToman(booking.price)} به کیف پول
                  رزرو‌کننده بازگردانده می‌شود.
                </p>
              ) : null}
              <AppButton
                variant="danger"
                disabled={cancelBooking.isPending}
                onClick={handleCancel}
                className="h-[46px] w-full text-[14.5px]"
              >
                لغو رزرو
              </AppButton>
            </div>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
