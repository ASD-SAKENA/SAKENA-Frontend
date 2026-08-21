import type { StatusColor } from "@/types/app.type";
import type { TransactionCategoryApi } from "@/types/wallet.api.type";

export const TRANSACTION_CATEGORY_META: Record<
  TransactionCategoryApi,
  { label: string; icon: string; color: StatusColor }
> = {
  CHARGE_COLLECTION: {
    label: "دریافت شارژ",
    icon: "payments",
    color: "success",
  },
  WAGE_SETTLEMENT: {
    label: "تسویه دستمزد",
    icon: "engineering",
    color: "info",
  },
  OPERATING_EXPENSE: {
    label: "هزینه جاری",
    icon: "receipt_long",
    color: "warning",
  },
  ADJUSTMENT: { label: "اصلاح حساب", icon: "filter_list", color: "steel" },
  WALLET_FUNDING: {
    label: "شارژ کیف پول",
    icon: "account_balance_wallet",
    color: "gold",
  },
  FACILITY_BOOKING: {
    label: "رزرو امکانات",
    icon: "event",
    color: "info",
  },
};
