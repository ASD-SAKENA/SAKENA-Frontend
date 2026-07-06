import type { StatusColor } from "@/types/app.type";

export interface Transaction {
  desc: string;
  date: string;
  type: string;
  color: StatusColor;
  amount: string;
  negative: boolean;
}

export interface WalletStat {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: StatusColor;
}

export interface Wallet {
  balance: number;
  stats: WalletStat[];
  transactions: Transaction[];
}
