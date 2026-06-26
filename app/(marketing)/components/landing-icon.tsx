import {
  BarChart3,
  Building2,
  CalendarDays,
  HardHat,
  Home,
  type LucideIcon,
  Megaphone,
  ReceiptText,
  Rocket,
  ShieldCheck,
  UserPlus,
  Wallet,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  wallet: Wallet,
  calendar: CalendarDays,
  wrench: Wrench,
  megaphone: Megaphone,
  building: Building2,
  chart: BarChart3,
  home: Home,
  shield: ShieldCheck,
  engineering: HardHat,
  "user-plus": UserPlus,
  receipt: ReceiptText,
  rocket: Rocket,
};

interface Props {
  name: string;
  className?: string;
}

export function LandingIcon({ name, className }: Props) {
  const Icon = ICONS[name] ?? Wallet;
  return <Icon className={cn("size-6", className)} strokeWidth={1.75} />;
}
