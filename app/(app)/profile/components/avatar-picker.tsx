"use client";

import { useRef, useState } from "react";

import { toast } from "sonner";

import { AppIcon } from "@/components/app/app-icon";
import { Avatar } from "@/components/app/avatar";

import { removeAvatar, uploadAvatar } from "@/api/profile";

import { useAuthStore } from "@/stores/auth.store";

/** Mirrors the server's rule, so an oversized file fails before uploading. */
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = "image/png,image/jpeg,image/webp";

/** Sets or clears the signed-in user's profile picture. */
export function AvatarPicker() {
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Clear immediately so picking the same file twice still fires a change.
    event.target.value = "";
    if (!file) return;

    if (file.size > MAX_BYTES) {
      toast.error("حجم تصویر باید حداکثر ۵ مگابایت باشد");
      return;
    }
    setBusy(true);
    try {
      await uploadAvatar(file);
      toast.success("تصویر پروفایل به‌روز شد");
    } catch {
      // The global http interceptor already surfaced the error toast.
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    try {
      await removeAvatar();
      toast.success("تصویر پروفایل حذف شد");
    } catch {
      // The global http interceptor already surfaced the error toast.
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar src={user?.avatarUrl} initial={user?.initial ?? "س"} size={64} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
          className="flex h-9 items-center gap-1.5 rounded-[10px] border border-app-border px-3 text-[12.5px] font-semibold text-app-fg transition-colors hover:border-app-gold hover:text-app-gold disabled:opacity-50"
        >
          <AppIcon name="image" className="size-[17px]" />
          {user?.avatarUrl ? "تغییر تصویر" : "انتخاب تصویر"}
        </button>

        {user?.avatarUrl ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={busy}
            className="h-9 rounded-[10px] border border-app-border px-3 text-[12.5px] font-semibold text-app-muted transition-colors hover:border-app-danger hover:text-app-danger disabled:opacity-50"
          >
            حذف تصویر
          </button>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          onChange={handleSelected}
          className="hidden"
        />
      </div>
    </div>
  );
}
