"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { AppButton } from "@/components/app/app-button";
import { AppField, AppInput, AppSelect } from "@/components/app/form-controls";
import { Modal } from "@/components/app/modal";

import { useCreateInvitationMutation } from "@/queries/invitations";
import { useBuildingsQuery, useUnitsQuery } from "@/queries/units";

import {
  INVITATION_CHANNEL_OPTIONS,
  type InvitationForm,
  invitationSchema,
} from "@/schemas/invitation.schema";
import { TENANCY_LABELS } from "@/schemas/residency.schema";

interface Props {
  open: boolean;
  buildingId: string | null;
  onClose: () => void;
  /** Receives the shareable link so phone/open-link invites can be copied. */
  onCreated: (acceptUrl: string) => void;
}

export function InvitationModal({
  open,
  buildingId,
  onClose,
  onCreated,
}: Props) {
  const { data: buildings = [] } = useBuildingsQuery();
  const { data: units = [] } = useUnitsQuery(buildingId ?? undefined);
  const createInvitation = useCreateInvitationMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvitationForm>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      channel: "EMAIL",
      recipient: "",
      role: "RESIDENT",
      apartmentId: "",
      tenancy: "TENANT",
    },
  });

  const [channel, role] = useWatch({ control, name: ["channel", "role"] });
  const buildingName = buildings.find((b) => b.id === buildingId)?.name;
  // Only residents live in a unit, and an open link has no addressee.
  const showUnit = role === "RESIDENT";
  const showRecipient = channel === "EMAIL";

  const onSubmit = handleSubmit(async (values) => {
    if (!buildingId) return;
    try {
      const invitation = await createInvitation.mutateAsync({
        buildingId,
        payload: {
          channel: values.channel,
          recipient: showRecipient ? values.recipient : undefined,
          role: values.role,
          apartmentId:
            showUnit && values.apartmentId ? values.apartmentId : undefined,
          tenancy: showUnit && values.apartmentId ? values.tenancy : undefined,
        },
      });
      toast.success(
        values.channel === "EMAIL"
          ? "دعوت‌نامه ایمیل شد"
          : "دعوت‌نامه ساخته شد؛ لینک را برای کاربر بفرستید",
      );
      onCreated(invitation.acceptUrl);
      reset();
      onClose();
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="دعوت به ساختمان"
      description={
        buildingName
          ? `دعوت‌نامه برای «${buildingName}» ساخته می‌شود.`
          : "ابتدا از بالای صفحه یک ساختمان انتخاب کنید."
      }
    >
      <form onSubmit={onSubmit} className="mt-4">
        <AppField label="روش دعوت" error={errors.channel?.message}>
          <AppSelect {...register("channel")}>
            {Object.entries(INVITATION_CHANNEL_OPTIONS).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </AppSelect>
        </AppField>

        {showRecipient ? (
          <AppField label="ایمیل" error={errors.recipient?.message}>
            <AppInput
              dir="ltr"
              placeholder="neighbour@mail.com"
              {...register("recipient")}
            />
          </AppField>
        ) : (
          <p className="mb-4 rounded-xl bg-app-surface2 px-3.5 py-2.5 text-[12.5px] leading-[1.9] text-app-muted">
            لینک عمومی برای هر کسی که آن را داشته باشد کار می‌کند. پس از ساخت،
            لینک را فقط برای افراد موردنظر بفرستید.
          </p>
        )}

        <AppField label="نقش" error={errors.role?.message}>
          <AppSelect {...register("role")}>
            <option value="RESIDENT">ساکن</option>
            <option value="STAFF">کارکن خدماتی</option>
          </AppSelect>
        </AppField>

        {showUnit ? (
          <>
            <AppField
              label="واحد (اختیاری)"
              error={errors.apartmentId?.message}
            >
              <AppSelect {...register("apartmentId")}>
                <option value="">بدون تخصیص واحد</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    واحد {unit.no}
                  </option>
                ))}
              </AppSelect>
            </AppField>

            <AppField label="وضعیت سکونت" error={errors.tenancy?.message}>
              <AppSelect {...register("tenancy")}>
                {Object.entries(TENANCY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </AppSelect>
            </AppField>
          </>
        ) : null}

        <div className="mt-2 flex gap-2.5">
          <AppButton
            type="submit"
            disabled={createInvitation.isPending || buildingId === null}
            className="h-[46px] flex-1"
          >
            ساخت دعوت‌نامه
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-[46px] px-6"
          >
            انصراف
          </AppButton>
        </div>
      </form>
    </Modal>
  );
}
