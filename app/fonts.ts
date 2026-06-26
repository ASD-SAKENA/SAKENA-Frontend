import { Figtree, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

export const estedad = localFont({
  src: "../public/fonts/Estedad/Estedad-FD[KSHD,wght].ttf",
  variable: "--font-estedad",
  display: "swap",
});

export const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
