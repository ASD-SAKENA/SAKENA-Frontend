"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/ui/collapsible";

import { useInvoiceLineItemsQuery } from "@/queries/billing";

import { CHARGE_KIND_LABELS } from "@/lib/billing";
import { faNumber } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

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
    <Collapsible open={open} onOpenChange={setOpen} className="mt-3">
      <CollapsibleTrigger className="group inline-flex items-center gap-1 rounded-md text-[12.5px] font-medium text-app-muted transition-colors outline-none hover:text-app-fg focus-visible:ring-2 focus-visible:ring-app-gold/40">
        جزئیات هزینه‌ها
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2.5">
          {isFetching && lines.length === 0 ? (
            <p className="py-1 text-[12.5px] text-app-muted">
              در حال بارگذاری…
            </p>
          ) : null}

          {isError ? (
            <p className="py-1 text-[12.5px] text-app-danger">
              جزئیات هزینه بارگذاری نشد.
            </p>
          ) : null}

          {!isFetching && !isError && lines.length === 0 ? (
            <p className="py-1 text-[12.5px] text-app-muted">
              ردیف هزینه‌ای ثبت نشده است.
            </p>
          ) : null}

          {lines.length > 0 ? (
            <ul className="divide-y divide-app-border border-t border-app-border">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex items-baseline justify-between gap-4 py-2.5 first:pt-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-app-fg">
                      {line.title}
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-app-muted">
                      {CHARGE_KIND_LABELS[line.kind]}
                    </div>
                  </div>
                  <div
                    className="shrink-0 text-[13px] font-semibold text-app-fg tabular-nums"
                    dir="ltr"
                  >
                    {faNumber(line.shareAmount)}{" "}
                    <span className="text-[11px] font-normal text-app-muted">
                      تومان
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
