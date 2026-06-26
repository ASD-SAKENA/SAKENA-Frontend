import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";

import type { LandingFaq } from "@/types/landing.type";

import { SectionHeading } from "./section-heading";

interface Props {
  faqs: LandingFaq[];
}

export function Faq({ faqs }: Props) {
  return (
    <section
      id="faq"
      className="border-t border-[var(--sk-border-subtle)] bg-[var(--sk-bg-band)]"
    >
      <div className="mx-auto max-w-[780px] px-8 py-[90px] max-[560px]:px-5">
        <SectionHeading
          eyebrow="سؤالات متداول"
          title="پرسش‌های پرتکرار"
          className="mb-12"
        />

        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="gap-3"
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${i}`}
              className="overflow-hidden rounded-[14px] border border-[var(--sk-border)] bg-[var(--sk-surface)]"
            >
              <AccordionTrigger className="px-[22px] py-5 text-[15.5px] font-semibold text-[var(--sk-text)] hover:no-underline **:data-[slot=accordion-trigger-icon]:size-[22px] **:data-[slot=accordion-trigger-icon]:text-[var(--sk-gold)]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-[22px] pb-5 text-sm leading-[2] text-[var(--sk-text-muted)]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
