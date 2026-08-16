"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { AppIcon } from "@/components/app/app-icon";

import { useSignupMutation } from "@/queries/auth";

import { useAuthStore } from "@/stores/auth.store";

import { roleHomePath } from "@/lib/app-nav";

import { type SignupForm, signupSchema } from "@/schemas/auth.schema";

import { RoleChips } from "./role-chips";

const inputClass =
  "h-[46px] w-full rounded-[11px] border border-[#2A3548] bg-[#10172A] pr-[42px] pl-3 text-right text-[14px] text-[#ECEEF3] outline-none transition-[border-color,box-shadow] placeholder:text-[#7A8294] focus:border-[var(--sk-gold)] focus:shadow-[0_0_0_3px_rgba(201,162,78,.18)]";

const iconClass =
  "pointer-events-none absolute top-1/2 right-[13px] size-[19px] -translate-y-1/2 text-[#7A8294]";

export function SignupForm() {
  const router = useRouter();
  // Invitees arrive via /join?token=…; `next` brings them back after auth.
  const next = useSearchParams().get("next");
  const loginStore = useAuthStore((state) => state.login);
  const mutation = useSignupMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      buildingCode: "",
      email: "",
      password: "",
      role: "resident",
    },
  });

  const [name, email, password, agree] = useWatch({
    control,
    name: ["name", "email", "password", "agree"],
  });
  const ready = Boolean(
    name?.trim() && email?.trim() && password?.trim() && agree,
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await mutation.mutateAsync({
        name: values.name,
        email: values.email,
        buildingCode: values.buildingCode || undefined,
        password: values.password,
        role: values.role,
      });
      loginStore(session.user, session.token);
      toast.success("حساب شما ساخته شد");
      router.push(next ?? roleHomePath(session.user.role));
    } catch {
      // The global http interceptor already surfaced the error toast.
    }
  });

  const disabled = !ready || mutation.isPending;

  return (
    <form onSubmit={onSubmit} className="sk-page" noValidate>
      <h1 className="mb-1.5 text-[24px] font-bold text-[var(--sk-text)]">
        ایجاد حساب کاربری
      </h1>
      <p className="mb-6 text-[14px] text-[var(--sk-text-muted)]">
        در چند ثانیه به ساکنا بپیوندید.
      </p>

      <label className="mb-[7px] block text-[13px] font-medium text-[#D4D8E0]">
        نام و نام خانوادگی
      </label>
      <div className="relative mb-[15px]">
        <AppIcon name="badge" className={iconClass} />
        <input
          {...register("name")}
          placeholder="مثلاً علی رضایی"
          className="h-[46px] w-full rounded-[11px] border border-[#2A3548] bg-[#10172A] pr-[42px] pl-3.5 text-right text-[14px] text-[#ECEEF3] transition-[border-color,box-shadow] outline-none placeholder:text-[#7A8294] focus:border-[var(--sk-gold)] focus:shadow-[0_0_0_3px_rgba(201,162,78,.18)]"
        />
      </div>

      <label className="mb-[7px] block text-[13px] font-medium text-[#D4D8E0]">
        کد مجتمع / دعوت
      </label>
      <div className="relative mb-[15px]">
        <AppIcon name="apartment" className={iconClass} />
        <input
          {...register("buildingCode")}
          dir="ltr"
          placeholder="SKN-1024"
          className={inputClass}
        />
      </div>

      <label className="mb-[7px] block text-[13px] font-medium text-[#D4D8E0]">
        ایمیل
      </label>
      <div className="relative mb-[15px]">
        <AppIcon name="mail" className={iconClass} />
        <input
          {...register("email")}
          dir="ltr"
          placeholder="example@mail.com"
          className="h-[46px] w-full rounded-[11px] border border-[#2A3548] bg-[#10172A] pr-[42px] pl-3.5 text-right text-[14px] text-[#ECEEF3] transition-[border-color,box-shadow] outline-none placeholder:text-[#7A8294] focus:border-[var(--sk-gold)] focus:shadow-[0_0_0_3px_rgba(201,162,78,.18)]"
        />
      </div>
      {errors.email ? (
        <p className="-mt-2.5 mb-3 text-[12px] text-[var(--sk-text-muted)]">
          {errors.email.message}
        </p>
      ) : null}

      <label className="mb-[7px] block text-[13px] font-medium text-[#D4D8E0]">
        رمز عبور
      </label>
      <div className="relative mb-[18px]">
        <AppIcon name="lock" className={iconClass} />
        <input
          {...register("password")}
          type="password"
          dir="ltr"
          placeholder="حداقل ۸ کاراکتر"
          className="h-[46px] w-full rounded-[11px] border border-[#2A3548] bg-[#10172A] pr-[42px] pl-3.5 text-right text-[14px] text-[#ECEEF3] transition-[border-color,box-shadow] outline-none placeholder:text-[#7A8294] focus:border-[var(--sk-gold)] focus:shadow-[0_0_0_3px_rgba(201,162,78,.18)]"
        />
      </div>
      {errors.password ? (
        <p className="-mt-3 mb-3 text-[12px] text-[var(--sk-text-muted)]">
          {errors.password.message}
        </p>
      ) : null}

      <label className="mb-[9px] block text-[13px] font-medium text-[#D4D8E0]">
        نقش شما
      </label>
      <div className="mb-[18px]">
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <RoleChips value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <label className="mb-5 flex cursor-pointer items-start gap-[9px]">
        <input
          {...register("agree")}
          type="checkbox"
          className="mt-0.5 size-4 accent-[var(--sk-gold)]"
        />
        <span className="text-[12.5px] leading-[1.8] text-[var(--sk-text-muted)]">
          با{" "}
          <a href="#" className="text-[var(--sk-gold)] no-underline">
            قوانین و مقررات
          </a>{" "}
          و{" "}
          <a href="#" className="text-[var(--sk-gold)] no-underline">
            حریم خصوصی
          </a>{" "}
          ساکنا موافقم.
        </span>
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="h-12 w-full rounded-xl bg-[linear-gradient(180deg,var(--sk-gold-light),var(--sk-gold))] text-[15.5px] font-bold text-[var(--sk-bg)] shadow-[0_8px_20px_rgba(201,162,78,.28)] transition-[filter,opacity] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ایجاد حساب و ورود
      </button>
    </form>
  );
}
