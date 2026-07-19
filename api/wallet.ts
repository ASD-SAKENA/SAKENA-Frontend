import http from "@/services/http";

import type { Wallet } from "@/types/wallet.type";

export const walletKeys = {
  all: ["wallet"] as const,
  me: ["wallet", "me"] as const,
};

const WALLET: Wallet = {
  balance: 2450000,
  stats: [
    {
      label: "پرداختی امسال",
      value: "۵٬۱۰۰٬۰۰۰",
      sub: "تومان",
      icon: "trending_up",
      color: "success",
    },
    {
      label: "بدهی جاری",
      value: "۸۵۰٬۰۰۰",
      sub: "شارژ تیر",
      icon: "schedule",
      color: "warning",
    },
  ],
  transactions: [
    {
      desc: "پرداخت شارژ خرداد",
      date: "۱ خرداد ۱۴۰۴",
      type: "شارژ",
      color: "info",
      amount: "−۸۵۰٬۰۰۰",
      negative: true,
    },
    {
      desc: "افزایش موجودی کیف پول",
      date: "۲۸ اردیبهشت",
      type: "واریز",
      color: "success",
      amount: "+۳٬۰۰۰٬۰۰۰",
      negative: false,
    },
    {
      desc: "رزرو سالن همایش",
      date: "۲۰ اردیبهشت",
      type: "رزرو",
      color: "gold",
      amount: "−۲۰۰٬۰۰۰",
      negative: true,
    },
    {
      desc: "پرداخت شارژ اردیبهشت",
      date: "۱ اردیبهشت",
      type: "شارژ",
      color: "info",
      amount: "−۸۵۰٬۰۰۰",
      negative: true,
    },
    {
      desc: "جریمه تأخیر فروردین",
      date: "۱۵ فروردین",
      type: "جریمه",
      color: "danger",
      amount: "−۵۰٬۰۰۰",
      negative: true,
    },
    {
      desc: "افزایش موجودی کیف پول",
      date: "۱۰ فروردین",
      type: "واریز",
      color: "success",
      amount: "+۲٬۰۰۰٬۰۰۰",
      negative: false,
    },
  ],
};

export async function getWallet(): Promise<Wallet> {
  // Mock: the real call will be `http.get<Wallet>("/wallet/")`.
  return WALLET;
}

/** Current user's wallet balance (worker wages land here after settlement). */
export async function getMyWalletBalance(): Promise<number> {
  const { data } = await http.get<{ balance: number }>("/wallets/me");
  return data.balance;
}

/** Manager pays out a completed service request's wage from the building account. */
export async function settleServiceRequest(
  serviceRequestId: string,
): Promise<void> {
  await http.post(`/wallets/settle/${serviceRequestId}`);
}
