import { z } from "zod";

/**
 * Channels a manager can pick when inviting. `PHONE` still exists on older
 * invitations, so it stays in the labels the join screen renders — it is just
 * no longer offered as a new option.
 */
export const INVITATION_CHANNEL_LABELS = {
  EMAIL: "ایمیل",
  PHONE: "شماره موبایل",
  LINK: "لینک عمومی",
} as const;

export const INVITATION_CHANNEL_OPTIONS = {
  EMAIL: INVITATION_CHANNEL_LABELS.EMAIL,
  LINK: INVITATION_CHANNEL_LABELS.LINK,
} as const;

export const INVITATION_STATUS_LABELS = {
  PENDING: "در انتظار",
  ACCEPTED: "پذیرفته‌شده",
  REVOKED: "لغوشده",
  EXPIRED: "منقضی",
} as const;

export const invitationSchema = z
  .object({
    channel: z.enum(["EMAIL", "LINK"]),
    recipient: z.string().trim().optional(),
    role: z.enum(["RESIDENT", "STAFF"]),
    apartmentId: z.string().optional(),
    tenancy: z.enum(["OWNER_OCCUPIER", "TENANT", "COMMERCIAL"]),
  })
  .superRefine((data, ctx) => {
    if (data.channel === "EMAIL") {
      const valid = z.string().email().safeParse(data.recipient).success;
      if (!valid) {
        ctx.addIssue({
          code: "custom",
          path: ["recipient"],
          message: "ایمیل معتبر وارد کنید.",
        });
      }
    }
    // Only residents live in a unit, so staff invitations never carry one.
    if (data.role === "STAFF" && data.apartmentId) {
      ctx.addIssue({
        code: "custom",
        path: ["apartmentId"],
        message: "کارکن خدماتی به واحد تخصیص داده نمی‌شود.",
      });
    }
  });

export type InvitationForm = z.infer<typeof invitationSchema>;
