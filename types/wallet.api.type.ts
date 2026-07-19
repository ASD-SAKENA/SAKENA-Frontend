/** Response shapes of the Sakena backend payment endpoints (`/api/v1/payments`). */

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
