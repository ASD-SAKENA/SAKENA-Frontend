/** Response shapes of the Sakena backend payment and wallet endpoints. */

export interface PaymentApiResponse {
  id: string;
  title: string;
  amount: number;
  paidAt: string;
}

export interface RecordPaymentApiPayload {
  title: string;
  amount: number;
}

export type TransactionDirectionApi = "CREDIT" | "DEBIT";

export type TransactionCategoryApi =
  | "CHARGE_COLLECTION"
  | "WAGE_SETTLEMENT"
  | "OPERATING_EXPENSE"
  | "ADJUSTMENT";

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
