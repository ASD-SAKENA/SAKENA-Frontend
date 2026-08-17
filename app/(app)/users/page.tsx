"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput, AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";
import { StatusBadge } from "@/components/app/status-badge";

import { useBuildingsQuery } from "@/queries/units";
import {
  useUpdateUserRoleMutation,
  useUpdateUserSpecialtyMutation,
  useUpdateUserStatusMutation,
  useUsersQuery,
} from "@/queries/users";

import { toFaDigits } from "@/lib/persian-number";
import { cn } from "@/lib/utils";

import { type SpecialtyForm, specialtySchema } from "@/schemas/user.schema";

import type { StatusColor } from "@/types/app.type";
import type {
  UserApiRole,
  UserSummaryApiResponse,
} from "@/types/users.api.type";

const ROLE_META: Record<UserApiRole, { label: string; color: StatusColor }> = {
  RESIDENT: { label: "ساکن", color: "info" },
  MANAGER: { label: "مدیر", color: "gold" },
  STAFF: { label: "کارکن", color: "steel" },
  ADMIN: { label: "مدیر سامانه", color: "danger" },
};

const ROLE_FILTERS: { value: UserApiRole | ""; label: string }[] = [
  { value: "", label: "همه نقش‌ها" },
  { value: "RESIDENT", label: "ساکن" },
  { value: "MANAGER", label: "مدیر" },
  { value: "STAFF", label: "کارکن" },
  { value: "ADMIN", label: "مدیر سامانه" },
];

const ASSIGNABLE_ROLES: UserApiRole[] = [
  "RESIDENT",
  "STAFF",
  "ADMIN",
  "MANAGER",
];

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<UserApiRole | "">("");
  const [specialtyTarget, setSpecialtyTarget] =
    useState<UserSummaryApiResponse | null>(null);
  const [managerTarget, setManagerTarget] = useState<{
    user: UserSummaryApiResponse;
    buildingId: string;
  } | null>(null);
  const { data: users = [] } = useUsersQuery(roleFilter || undefined);
  const { data: buildings = [] } = useBuildingsQuery({
    enabled: managerTarget !== null,
  });
  const updateStatus = useUpdateUserStatusMutation();
  const updateSpecialty = useUpdateUserSpecialtyMutation();
  const updateRole = useUpdateUserRoleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpecialtyForm>({
    resolver: zodResolver(specialtySchema),
    defaultValues: { specialty: "" },
  });

  const openSpecialtyModal = (user: UserSummaryApiResponse) => {
    reset({ specialty: user.specialty ?? "" });
    setSpecialtyTarget(user);
  };

  const onSpecialtySubmit = handleSubmit(async (values) => {
    if (!specialtyTarget) return;
    try {
      await updateSpecialty.mutateAsync({
        id: specialtyTarget.id,
        specialty: values.specialty,
      });
      toast.success(`تخصص «${specialtyTarget.username}» ذخیره شد`);
      reset();
      setSpecialtyTarget(null);
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  const handleToggleStatus = (user: UserSummaryApiResponse) => {
    const nextActive = !user.active;
    updateStatus.mutate(
      { id: user.id, active: nextActive },
      {
        onSuccess: () => {
          toast.success(
            nextActive
              ? `حساب «${user.username}» فعال شد`
              : `حساب «${user.username}» غیرفعال شد`,
          );
        },
      },
    );
  };

  const handleChangeRole = (
    user: UserSummaryApiResponse,
    role: UserApiRole,
  ) => {
    if (role === user.role) return;
    if (role === "MANAGER") {
      setManagerTarget({ user, buildingId: "" });
      return;
    }
    updateRole.mutate(
      { id: user.id, role },
      {
        onSuccess: () =>
          toast.success(
            `نقش «${user.username}» به ${ROLE_META[role].label} تغییر کرد`,
          ),
      },
    );
  };

  const onManagerSubmit = () => {
    if (!managerTarget || !managerTarget.buildingId) return;
    updateRole.mutate(
      {
        id: managerTarget.user.id,
        role: "MANAGER",
        managedBuildingId: managerTarget.buildingId,
      },
      {
        onSuccess: () => {
          toast.success(`«${managerTarget.user.username}» مدیر ساختمان شد`);
          setManagerTarget(null);
        },
      },
    );
  };

  return (
    <div className="sk-page flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AppSelect
          value={roleFilter}
          onChange={(e) => {
            const v = e.target.value;
            if (
              v === "" ||
              v === "RESIDENT" ||
              v === "MANAGER" ||
              v === "STAFF" ||
              v === "ADMIN"
            ) {
              setRoleFilter(v);
            }
          }}
          className="h-[38px] w-[200px] rounded-[10px] text-[13px]"
        >
          {ROLE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </AppSelect>
      </div>

      <div className="overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-[var(--ap-shadow-sm)]">
        <div className="flex items-center justify-between border-b border-app-border px-[18px] py-4">
          <div className="text-[15px] font-bold text-app-fg">
            کاربران سامانه
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-[13.5px]">
            <thead>
              <tr className="text-right text-[12.5px] text-app-muted">
                <th className="px-[18px] py-[13px] font-medium">کاربر</th>
                <th className="px-[18px] py-[13px] font-medium">ایمیل</th>
                <th className="px-[18px] py-[13px] font-medium">نقش</th>
                <th className="px-[18px] py-[13px] font-medium">تخصص</th>
                <th className="px-[18px] py-[13px] font-medium">وضعیت</th>
                <th className="px-[18px] py-[13px] font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-app-border hover:bg-app-surface2"
                >
                  <td className="px-[18px] py-[13px] font-bold text-app-fg">
                    {u.username}
                  </td>
                  <td className="px-[18px] py-[13px] text-app-muted" dir="ltr">
                    {u.email}
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <StatusBadge color={ROLE_META[u.role].color}>
                      {ROLE_META[u.role].label}
                    </StatusBadge>
                  </td>
                  <td className="px-[18px] py-[13px] text-app-fg">
                    {u.specialty ?? "—"}
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <StatusBadge color={u.active ? "success" : "danger"}>
                      {u.active ? "فعال" : "غیرفعال"}
                    </StatusBadge>
                  </td>
                  <td className="px-[18px] py-[13px]">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
                        disabled={updateStatus.isPending}
                        className={cn(
                          "flex h-8 items-center gap-1.5 rounded-lg border border-app-border bg-transparent px-3 text-[12.5px] font-semibold transition-colors disabled:opacity-50",
                          u.active
                            ? "text-app-danger hover:border-app-danger"
                            : "text-app-success hover:border-app-success",
                        )}
                      >
                        {u.active ? "غیرفعال‌سازی" : "فعال‌سازی"}
                      </button>
                      {u.role === "STAFF" ? (
                        <button
                          type="button"
                          onClick={() => openSpecialtyModal(u)}
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-app-border bg-transparent px-3 text-[12.5px] font-semibold text-app-gold transition-colors hover:border-app-gold"
                        >
                          ویرایش تخصص
                        </button>
                      ) : null}
                      <AppSelect
                        value={u.role}
                        disabled={updateRole.isPending}
                        onChange={(e) => {
                          const role = e.target.value;
                          if (
                            role === "RESIDENT" ||
                            role === "STAFF" ||
                            role === "ADMIN" ||
                            role === "MANAGER"
                          ) {
                            handleChangeRole(u, role);
                          }
                        }}
                        className="h-8 w-auto min-w-[110px] rounded-lg text-[12.5px]"
                      >
                        {(u.role === "MANAGER"
                          ? [
                              u.role,
                              ...ASSIGNABLE_ROLES.filter((r) => r !== u.role),
                            ]
                          : ASSIGNABLE_ROLES
                        ).map((role) => (
                          <option key={role} value={role}>
                            {ROLE_META[role].label}
                          </option>
                        ))}
                      </AppSelect>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-app-border px-[18px] py-[14px] text-[13px] text-app-muted">
          نمایش {toFaDigits(users.length)} کاربر
        </div>
      </div>

      <Modal
        open={managerTarget !== null}
        onClose={() => setManagerTarget(null)}
        title="انتساب مدیر ساختمان"
        description={
          managerTarget
            ? `ساختمانی که «${managerTarget.user.username}» مدیر آن خواهد بود را انتخاب کنید.`
            : undefined
        }
        icon="apartment"
      >
        <div className="mt-4">
          <AppField label="ساختمان">
            <AppSelect
              value={managerTarget?.buildingId ?? ""}
              onChange={(e) =>
                setManagerTarget((prev) =>
                  prev ? { ...prev, buildingId: e.target.value } : prev,
                )
              }
            >
              <option value="">انتخاب کنید</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </AppSelect>
          </AppField>
          <div className="mt-4 flex gap-2.5">
            <AppButton
              type="button"
              onClick={onManagerSubmit}
              disabled={!managerTarget?.buildingId || updateRole.isPending}
              className="h-[46px] flex-1"
            >
              ثبت
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              onClick={() => setManagerTarget(null)}
              className="h-[46px] px-6"
            >
              انصراف
            </AppButton>
          </div>
        </div>
      </Modal>

      <Modal
        open={specialtyTarget !== null}
        onClose={() => setSpecialtyTarget(null)}
        title="ویرایش تخصص"
        description={
          specialtyTarget
            ? `تخصص کارکن «${specialtyTarget.username}» را مشخص کنید.`
            : undefined
        }
        icon="engineering"
      >
        <form onSubmit={onSpecialtySubmit} className="mt-4">
          <AppField label="تخصص" error={errors.specialty?.message}>
            <AppInput
              placeholder="مثلاً برق‌کاری، تأسیسات، نظافت"
              {...register("specialty")}
            />
          </AppField>
          <div className="mt-2 flex gap-2.5">
            <AppButton
              type="submit"
              disabled={updateSpecialty.isPending}
              className="h-[46px] flex-1"
            >
              ذخیره تخصص
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              onClick={() => setSpecialtyTarget(null)}
              className="h-[46px] px-6"
            >
              انصراف
            </AppButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
