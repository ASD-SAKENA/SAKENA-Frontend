import { TooltipProvider } from "@/ui/tooltip";

export default function ShadcnTooltipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
