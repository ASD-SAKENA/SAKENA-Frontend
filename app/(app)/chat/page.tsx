"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppIcon } from "@/components/app/app-icon";

import { useChatMessagesQuery, useDeleteMessageMutation } from "@/queries/chat";
import { useMyResidencyQuery } from "@/queries/residency";
import { useBuildingsQuery } from "@/queries/units";

import { useAuthStore } from "@/stores/auth.store";

import type { ChatMessageApiResponse } from "@/types/chat.api.type";

import { ChatComposer } from "./components/chat-composer";
import { EditMessageModal } from "./components/edit-message-modal";
import { MessageList } from "./components/message-list";

/**
 * A manager administers exactly one building, so their chat is that building
 * — no picker needed. A resident's building is resolved from their own
 * residency. Staff have no building chat at all (see the API's manager/
 * resident-only membership check).
 */
function useOwnBuilding(role: string | undefined) {
  const isManager = role === "manager";
  const { data: buildings = [] } = useBuildingsQuery({ enabled: isManager });
  const { data: residency } = useMyResidencyQuery({ enabled: !isManager });

  return isManager
    ? (buildings[0]?.id ?? null)
    : (residency?.buildingId ?? null);
}

export default function ChatPage() {
  const role = useAuthStore((s) => s.user?.role);
  const hasChatAccess = role === "resident" || role === "manager";
  const buildingId = useOwnBuilding(role);
  const [editTarget, setEditTarget] = useState<ChatMessageApiResponse | null>(
    null,
  );

  const { messages, isLoading, hasMoreOlder, isLoadingOlder, loadOlder } =
    useChatMessagesQuery(buildingId);
  const deleteMessage = useDeleteMessageMutation(buildingId);

  const handleDelete = (message: ChatMessageApiResponse) => {
    deleteMessage.mutate(message.id, {
      onSuccess: () => toast.success("پیام حذف شد"),
    });
  };

  if (!hasChatAccess) {
    return (
      <div className="sk-page">
        <div className="flex h-[calc(100dvh-190px)] min-h-[420px] items-center justify-center rounded-2xl border border-app-border bg-app-bg p-8 text-center text-[13.5px] text-app-muted shadow-[var(--ap-shadow-sm)]">
          گفتگوی ساختمان فقط برای ساکنین و مدیر همان ساختمان در دسترس است.
        </div>
      </div>
    );
  }

  return (
    <div className="sk-page">
      <div className="flex h-[calc(100dvh-190px)] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-app-border bg-app-bg shadow-[var(--ap-shadow-sm)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-app-border bg-app-surface px-4 py-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--ap-gold-soft)]">
            <AppIcon name="chat" className="size-5 text-app-gold" />
          </div>
          <div className="flex-1">
            <div className="text-[14.5px] font-bold text-app-fg">
              گفتگوی ساکنین
            </div>
            <div className="text-[12px] text-app-muted">
              {role === "manager"
                ? "به‌عنوان مدیر می‌توانید هر پیامی را حذف کنید."
                : "پیام‌های خود را می‌توانید ویرایش یا حذف کنید."}
            </div>
          </div>
        </div>

        {buildingId === null ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-[13.5px] text-app-muted">
            {isLoading
              ? "در حال بارگذاری…"
              : role === "manager"
                ? "هنوز ساختمانی ثبت نشده است؛ پس از ثبت ساختمان، گفتگو در دسترس قرار می‌گیرد."
                : "هنوز واحدی به شما تخصیص داده نشده است؛ پس از تخصیص واحد، گفتگو در دسترس قرار می‌گیرد."}
          </div>
        ) : (
          <MessageList
            messages={messages}
            canModerate={role === "manager"}
            onEdit={setEditTarget}
            onDelete={handleDelete}
            hasMoreOlder={hasMoreOlder}
            isLoadingOlder={isLoadingOlder}
            onLoadOlder={loadOlder}
          />
        )}

        <ChatComposer buildingId={buildingId} />
      </div>

      <EditMessageModal
        buildingId={buildingId}
        message={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </div>
  );
}
