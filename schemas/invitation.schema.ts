import { z } from "zod";

export const INVITATION_CHANNEL_LABELS = {
  EMAIL: "ایمیل",
  PHONE: "شماره موبایل",
  LINK: "لینک عمومی",
} as const;

export const INVITATION_STATUS_LABELS = {
  PENDING: "در انتظار",
  ACCEPTED: "پذیرفته‌شده",
  REVOKED: "لغوشده",
  EXPIRED: "منقضی",
} as const;

export const invitationSchema = z
  .object({
    channel: z.enum(["EMAIL", "PHONE", "LINK"]),
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
    if (data.channel === "PHONE" && !/^0?9\d{9}$/.test(data.recipient ?? "")) {
      ctx.addIssue({
        code: "custom",
        path: ["recipient"],
        message: "شماره موبایل معتبر وارد کنید.",
      });
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
