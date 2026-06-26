import type { Metadata, Viewport } from "next";

import {
  QueryProvider,
  ShadcnTooltipProvider,
  SonnerProvider,
} from "@/providers";
import "katex/dist/katex.min.css";
import NextTopLoader from "nextjs-toploader";

import { estedad, figtree, geistMono, geistSans } from "@/app/fonts";
import { siteMetadata } from "@/app/metadata";
import { siteViewport } from "@/app/viewport";

import { JsonLd } from "@/components/seo/json-ld";

import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" className={`${estedad.variable} ${figtree.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased`}
      >
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />

        <NextTopLoader color="#c9a24e" height={2} showSpinner={false} />
        <QueryProvider>
          <ShadcnTooltipProvider>
            {children}
            <SonnerProvider />
          </ShadcnTooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
