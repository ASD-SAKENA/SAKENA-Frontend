import http from "@/services/http";

import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";

import type {
  PaymentApiResponse,
  RecordBuildingTransactionApiPayload,
  RecordPaymentApiPayload,
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
 * The backend models the resident's payment history; wallet balance and
 * debt are not modelled server-side yet, so those stats derive from the
 * payments (total paid) or stay placeholders until a wallet context lands.
 */
export async function getWallet(): Promise<Wallet> {
  const { data } = await http.get<PaymentApiResponse[]>("/payments");
  const totalPaid = data.reduce((sum, p) => sum + p.amount, 0);
  return {
    balance: 0,
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
  const { data } = await http.get<{ balance: number }>("/wallets/me");
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
