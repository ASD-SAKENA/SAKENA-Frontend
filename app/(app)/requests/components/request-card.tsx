import { AppIcon } from "@/components/app/app-icon";
import { StatusBadge } from "@/components/app/status-badge";

import type { ServiceRequest } from "@/types/requests.type";

interface Props {
  request: ServiceRequest;
}

export function RequestCard({ request }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-app-border bg-app-surface p-[18px] shadow-[var(--ap-shadow-sm)]">
      <div className="flex size-[46px] flex-shrink-0 items-center justify-center rounded-xl bg-app-surface2">
        <AppIcon name={request.icon} className="size-[23px] text-app-steel" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-[5px] flex items-center gap-2.5">
          <span className="text-[14.5px] font-bold">{request.title}</span>
          <span className="text-[11.5px] text-app-muted">#{request.id}</span>
        </div>
        <div className="text-[13px] text-app-muted">{request.description}</div>
      </div>
      <div className="flex-shrink-0 text-left">
        <StatusBadge color={request.statusColor}>{request.status}</StatusBadge>
        <div className="mt-2 text-[12px] text-app-muted">{request.date}</div>
      </div>
    </div>
  );
}
