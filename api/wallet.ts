import http from "@/services/http";

import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";

import type {
  PaymentApiResponse,
  RecordPaymentApiPayload,
} from "@/types/wallet.api.type";
import type { Transaction, Wallet } from "@/types/wallet.type";

export const walletKeys = {
  all: ["wallet"] as const,
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
