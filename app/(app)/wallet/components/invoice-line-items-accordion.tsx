"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";

import { useInvoiceLineItemsQuery } from "@/queries/billing";

import { ALLOCATION_LABELS, CHARGE_KIND_LABELS } from "@/lib/billing";
import { faNumber } from "@/lib/persian-number";

interface Props {
  invoiceId: string;
}

export function InvoiceLineItemsAccordion({ invoiceId }: Props) {
  const [open, setOpen] = useState(false);
  const {
    data: lines = [],
    isFetching,
    isError,
  } = useInvoiceLineItemsQuery(invoiceId, { enabled: open });

  return (
    <Accordion
      type="single"
      collapsible
      className="mt-2 w-full"
      onValueChange={(value) => setOpen(value === "details")}
    >
      <AccordionItem value="details" className="border-0">
        <AccordionTrigger className="py-2 text-[12.5px] font-semibold text-app-muted hover:no-underline **:data-[slot=accordion-trigger-icon]:text-app-muted">
          جزئیات هزینه‌های این صورت‌حساب
        </AccordionTrigger>
        <AccordionContent className="pb-1">
          {isFetching && lines.length === 0 ? (
            <p className="text-[12.5px] text-app-muted">در حال بارگذاری…</p>
          ) : null}
          {isError ? (
            <p className="text-[12.5px] text-app-danger">
              جزئیات هزینه بارگذاری نشد.
            </p>
          ) : null}
          {!isFetching && !isError && lines.length === 0 ? (
            <p className="text-[12.5px] text-app-muted">
              ردیف هزینه‌ای برای این صورت‌حساب ثبت نشده است.
            </p>
          ) : null}
          {lines.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex items-start justify-between gap-3 rounded-lg bg-app-surface px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-app-fg">
                      {line.title}
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-app-muted">
                      {CHARGE_KIND_LABELS[line.kind]} ·{" "}
                      {ALLOCATION_LABELS[line.allocation]}
                    </div>
                  </div>
                  <div className="shrink-0 text-left" dir="ltr">
                    <div className="text-[13px] font-bold text-app-fg">
                      {faNumber(line.shareAmount)}
                    </div>
                    <div className="text-[11px] text-app-muted">تومان</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
