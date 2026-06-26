"use client";

import { useLandingContentQuery } from "@/queries/landing";

import { Cta } from "./cta";
import { Faq } from "./faq";
import { Features } from "./features";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { Roles } from "./roles";
import { StatsBand } from "./stats-band";

export function LandingContent() {
  const { data } = useLandingContentQuery();

  if (!data) return null;

  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[var(--sk-bg)] text-[var(--sk-text)] antialiased"
    >
      <Header />
      <Hero hero={data.hero} />
      <StatsBand stats={data.stats} />
      <Features features={data.features} />
      <Roles roles={data.roles} />
      <HowItWorks steps={data.steps} />
      <Faq faqs={data.faqs} />
      <Cta />
      <Footer columns={data.footerColumns} />
    </div>
  );
}
