import http from "@/services/http";

import { formatFaDate } from "@/lib/format-date";
import { faNumber } from "@/lib/persian-number";
import { TRANSACTION_CATEGORY_META } from "@/lib/wallet";

import type {
  PaymentApiResponse,
  PaymentApiStatus,
  RecordBuildingTransactionApiPayload,
  SubmitInvoicePaymentPayload,
  WalletBalanceApiResponse,
  WalletTransactionApiResponse,
} from "@/types/wallet.api.type";
import type { Transaction, Wallet } from "@/types/wallet.type";

export const walletKeys = {
  all: ["wallet"] as const,
  me: ["wallet", "me"] as const,
  myLedger: ["wallet", "me", "transactions"] as const,
  building: ["wallet", "building"] as const,
  buildingLedger: ["wallet", "building", "transactions"] as const,
  submissions: ["wallet", "submissions"] as const,
  pendingPayments: ["wallet", "pending-payments"] as const,
  buildingPayments: (status?: string, periodId?: string) =>
    [
      "wallet",
      "building-payments",
      status ?? "all",
      periodId ?? "all",
    ] as const,
};

function toTransaction(tx: WalletTransactionApiResponse): Transaction {
  const meta = TRANSACTION_CATEGORY_META[tx.category];
  const outgoing = tx.direction === "DEBIT";
  return {
    id: tx.id,
    desc: tx.description,
    date: formatFaDate(tx.occurredAt),
    type: meta.label,
    color: meta.color,
    amount: `${outgoing ? "−" : "+"}${faNumber(tx.amount)}`,
    negative: outgoing,
  };
}

/** The current user's own wallet ledger, newest first. */
export async function getMyLedger(): Promise<WalletTransactionApiResponse[]> {
  const { data } = await http.get<WalletTransactionApiResponse[]>(
    "/wallets/me/transactions",
  );
  return data;
}

/**
 * Balance and history both come from the wallet ledger, so every movement —
 * a charge payment, a facility booking, a top-up — is accounted for. Reading
 * history from /payments used to hide anything that was not an invoice.
 */
export async function getWallet(): Promise<Wallet> {
  const [ledger, balance] = await Promise.all([
    getMyLedger(),
    getMyWalletBalance(),
  ]);
  const spent = ledger
    .filter((tx) => tx.direction === "DEBIT")
    .reduce((sum, tx) => sum + tx.amount, 0);
  return {
    balance,
    stats: [
      {
        label: "مجموع پرداختی‌ها",
        value: faNumber(spent),
        sub: "تومان",
        icon: "trending_up",
        color: "success",
      },
      {
        label: "تعداد تراکنش‌ها",
        value: faNumber(ledger.length),
        sub: "تراکنش",
        icon: "receipt_long",
        color: "info",
      },
    ],
    transactions: ledger.map(toTransaction),
  };
}

/** Submit bank-transfer evidence against a specific unit invoice. */
export async function submitInvoicePayment(
  payload: SubmitInvoicePaymentPayload,
): Promise<PaymentApiResponse> {
  const form = new FormData();
  form.append(
    "payment",
    new Blob(
      [
        JSON.stringify({
          invoiceId: payload.invoiceId,
          amount: payload.amount,
          transactionReference: payload.transactionReference,
        }),
      ],
      { type: "application/json" },
    ),
  );
  if (payload.receipt) {
    form.append("receipt", payload.receipt);
  }
  const { data } = await http.post<PaymentApiResponse>("/payments", form, {
    // Let the browser set the multipart boundary.
    headers: { "Content-Type": undefined },
  });
  return data;
}

export async function getPaymentSubmissions(): Promise<PaymentApiResponse[]> {
  const { data } = await http.get<PaymentApiResponse[]>(
    "/payments/submissions",
  );
  return data;
}

export async function getPendingPayments(): Promise<PaymentApiResponse[]> {
  const { data } = await http.get<PaymentApiResponse[]>("/payments/pending");
  return data;
}

export async function getBuildingPayments(options?: {
  status?: PaymentApiStatus;
  periodId?: string;
}): Promise<PaymentApiResponse[]> {
  const { data } = await http.get<PaymentApiResponse[]>("/payments/building", {
    params: {
      status: options?.status,
      periodId: options?.periodId,
    },
  });
  return data;
}

export async function confirmPayment(
  paymentId: string,
): Promise<PaymentApiResponse> {
  const { data } = await http.patch<PaymentApiResponse>(
    `/payments/${paymentId}/confirm`,
  );
  return data;
}

export async function rejectPayment(
  paymentId: string,
  reason: string,
): Promise<PaymentApiResponse> {
  const { data } = await http.patch<PaymentApiResponse>(
    `/payments/${paymentId}/reject`,
    { reason },
  );
  return data;
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
