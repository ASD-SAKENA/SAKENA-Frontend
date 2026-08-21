/** Response shapes of the Sakena backend payment and wallet endpoints. */

export type PaymentApiStatus = "PENDING" | "CONFIRMED" | "REJECTED";

export interface PaymentApiResponse {
  id: string;
  invoiceId: string | null;
  periodTitle: string | null;
  title: string;
  amount: number;
  transactionReference: string;
  hasReceipt: boolean;
  status: PaymentApiStatus;
  paidAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface SubmitInvoicePaymentPayload {
  invoiceId: string;
  amount: number;
  transactionReference: string;
  receipt?: File | null;
}

export type TransactionDirectionApi = "CREDIT" | "DEBIT";

export type TransactionCategoryApi =
  | "CHARGE_COLLECTION"
  | "WAGE_SETTLEMENT"
  | "OPERATING_EXPENSE"
  | "ADJUSTMENT"
  | "WALLET_FUNDING";

export interface WalletTransactionApiResponse {
  id: string;
  direction: TransactionDirectionApi;
  category: TransactionCategoryApi;
  amount: number;
  description: string;
  /** Wallet balance right after this line, so the ledger reads like a statement. */
  balanceAfter: number;
  occurredAt: string;
}

export interface RecordBuildingTransactionApiPayload {
  direction: TransactionDirectionApi;
  category: TransactionCategoryApi;
  amount: number;
  description: string;
}

export interface WalletBalanceApiResponse {
  balance: number;
}
