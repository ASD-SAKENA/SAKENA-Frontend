import { ArrowLeft } from "lucide-react";

import { BrandLink } from "@/components/brand/brand-buttons";
import { StatusScreen } from "@/components/brand/status-screen";

export default function NotFound() {
  return (
    <StatusScreen
      badge="۴۰۴"
      title="صفحه‌ای که دنبالش بودید پیدا نشد"
      description="ممکن است آدرس اشتباه وارد شده باشد یا صفحه جابه‌جا شده باشد."
    >
      <BrandLink href="/">
        بازگشت به خانه
        <ArrowLeft className="size-[18px]" />
      </BrandLink>
    </StatusScreen>
  );
}
