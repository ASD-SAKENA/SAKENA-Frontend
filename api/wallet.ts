import http from "@/services/http";

import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";

import type {
  PaymentApiResponse,
  RecordBuildingTransactionApiPayload,
  RecordPaymentApiPayload,
  WalletBalanceApiResponse,
  WalletTransactionApiResponse,
} from "@/types/wallet.api.type";
import type { Transaction, Wallet } from "@/types/wallet.type";

export const walletKeys = {
  all: ["wallet"] as const,
  me: ["wallet", "me"] as const,
  building: ["wallet", "building"] as const,
  buildingLedger: ["wallet", "building", "transactions"] as const,
};

function toTransaction(payment: PaymentApiResponse): Transaction {
  return {
    id: payment.id,
    desc: payment.title,
    date: formatFaDate(payment.paidAt),
    type: "پرداخت",
    color: "info",
    amount: `−${faNumber(payment.amount)}`,
    negative: true,
  };
}

/**
 * Balance comes from the real wallet endpoint; the stats/history below still
 * derive from payment records until a full transaction ledger lands for
 * residents (buildings already have one - see getBuildingLedger).
 */
export async function getWallet(): Promise<Wallet> {
  const [{ data }, balance] = await Promise.all([
    http.get<PaymentApiResponse[]>("/payments"),
    getMyWalletBalance(),
  ]);
  const totalPaid = data.reduce((sum, p) => sum + p.amount, 0);
  return {
    balance,
    stats: [
      {
        label: "مجموع پرداختی‌ها",
        value: faNumber(totalPaid),
        sub: "تومان",
        icon: "trending_up",
        color: "success",
      },
      {
        label: "تعداد پرداخت‌ها",
        value: faNumber(data.length),
        sub: "تراکنش",
        icon: "receipt_long",
        color: "info",
      },
    ],
    transactions: data.map(toTransaction),
  };
}

export async function recordPayment(
  payload: RecordPaymentApiPayload,
): Promise<{ id: string }> {
  const { data } = await http.post<PaymentApiResponse>("/payments", payload);
  return { id: data.id };
}

/** Current user's wallet balance (worker wages land here after settlement). */
export async function getMyWalletBalance(): Promise<number> {
  const { data } = await http.get<WalletBalanceApiResponse>("/wallets/me");
  return data.balance;
}

/** Resident tops up their own wallet; returns the new balance. */
export async function fundWallet(amount: number): Promise<number> {
  const { data } = await http.post<WalletBalanceApiResponse>(
    "/wallets/me/top-ups",
    { amount },
  );
  return data.balance;
}

/** Manager pays out a completed service request's wage from the building account. */
export async function settleServiceRequest(
  serviceRequestId: string,
): Promise<void> {
  await http.post(`/wallets/settle/${serviceRequestId}`);
}

/** Shared building account: collected charges minus what the building spent. */
export async function getBuildingWalletBalance(): Promise<number> {
  const { data } = await http.get<{ balance: number }>("/wallets/building");
  return data.balance;
}

export async function getBuildingLedger(): Promise<
  WalletTransactionApiResponse[]
> {
  const { data } = await http.get<WalletTransactionApiResponse[]>(
    "/wallets/building/transactions",
  );
  return data;
}

export async function recordBuildingTransaction(
  payload: RecordBuildingTransactionApiPayload,
): Promise<void> {
  await http.post("/wallets/building/transactions", payload);
}
