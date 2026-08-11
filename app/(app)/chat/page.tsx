"use client";

import { useState } from "react";

import { toast } from "sonner";

import { AppIcon } from "@/components/app/app-icon";
import { AppSelect } from "@/components/app/form-controls";

import { useChatMessagesQuery, useDeleteMessageMutation } from "@/queries/chat";
import { useBuildingsQuery } from "@/queries/units";

import { useAuthStore } from "@/stores/auth.store";

import type { ChatMessageApiResponse } from "@/types/chat.api.type";

import { ChatComposer } from "./components/chat-composer";
import { EditMessageModal } from "./components/edit-message-modal";
import { MessageList } from "./components/message-list";

export default function ChatPage() {
  const role = useAuthStore((s) => s.user?.role);
  const { data: buildings = [] } = useBuildingsQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<ChatMessageApiResponse | null>(
    null,
  );

  // Falls back to the first building until the user picks one explicitly.
  const buildingId =
    buildings.find((b) => b.id === selectedId)?.id ?? buildings[0]?.id ?? null;

  const { data: messages = [] } = useChatMessagesQuery(buildingId);
  const deleteMessage = useDeleteMessageMutation(buildingId);

  const handleDelete = (message: ChatMessageApiResponse) => {
    deleteMessage.mutate(message.id, {
      onSuccess: () => toast.success("پیام حذف شد"),
    });
  };

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

          {buildings.length > 1 ? (
            <AppSelect
              value={buildingId ?? ""}
              onChange={(event) => setSelectedId(event.target.value)}
              className="h-[38px] w-auto min-w-[180px]"
            >
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </AppSelect>
          ) : null}
        </div>

        {buildingId === null ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-[13.5px] text-app-muted">
            هنوز ساختمانی ثبت نشده است؛ پس از ثبت ساختمان، گفتگو در دسترس قرار
            می‌گیرد.
          </div>
        ) : (
          <MessageList
            messages={messages}
            canModerate={role === "manager"}
            onEdit={setEditTarget}
            onDelete={handleDelete}
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
