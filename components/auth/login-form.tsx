"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppIcon } from "@/components/app/app-icon";

import { useLoginMutation } from "@/queries/auth";

import { useAuthStore } from "@/stores/auth.store";

import { roleHomePath } from "@/lib/app-nav";

import { type LoginForm, loginSchema } from "@/schemas/auth.schema";

import { RoleChips } from "./role-chips";

const inputClass =
  "h-[46px] w-full rounded-[11px] border border-[#2A3548] bg-[#10172A] pr-[42px] pl-3.5 text-right text-[14px] text-[#ECEEF3] outline-none transition-[border-color,box-shadow] placeholder:text-[#7A8294] focus:border-[var(--sk-gold)] focus:shadow-[0_0_0_3px_rgba(201,162,78,.18)]";

export function LoginForm() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);
  const mutation = useLoginMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      role: "resident",
      remember: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const { role } = await mutation.mutateAsync({
      identifier: values.identifier,
      password: values.password,
      role: values.role,
    });
    loginStore(role);
    toast.success("خوش آمدید");
    router.push(roleHomePath(role));
  });

  return (
    <form onSubmit={onSubmit} className="sk-page" noValidate>
      <h1 className="mb-1.5 text-[24px] font-bold text-[var(--sk-text)]">
        ورود به حساب
      </h1>
      <p className="mb-[26px] text-[14px] text-[var(--sk-text-muted)]">
        نقش خود را انتخاب و وارد شوید.
      </p>

      <div className="mb-[9px] text-[13px] font-medium text-[#D4D8E0]">
        ورود به‌عنوان
      </div>
      <div className="mb-[22px]">
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <RoleChips value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <label className="mb-[7px] block text-[13px] font-medium text-[#D4D8E0]">
        ایمیل یا شماره موبایل
      </label>
      <div className="relative mb-4">
        <AppIcon
          name="person"
          className="pointer-events-none absolute top-1/2 right-[13px] size-[19px] -translate-y-1/2 text-[#7A8294]"
        />
        <input
          {...register("identifier")}
          dir="ltr"
          placeholder="example@mail.com"
          className={inputClass}
        />
      </div>
      {errors.identifier ? (
        <p className="-mt-2.5 mb-3 text-[12px] text-[var(--sk-text-muted)]">
          {errors.identifier.message}
        </p>
      ) : null}

      <label className="mb-[7px] block text-[13px] font-medium text-[#D4D8E0]">
        رمز عبور
      </label>
      <div className="relative mb-3.5">
        <AppIcon
          name="lock"
          className="pointer-events-none absolute top-1/2 right-[13px] size-[19px] -translate-y-1/2 text-[#7A8294]"
        />
        <input
          {...register("password")}
          type="password"
          dir="ltr"
          placeholder="••••••••"
          className={inputClass}
        />
      </div>
      {errors.password ? (
        <p className="-mt-2 mb-3 text-[12px] text-[var(--sk-text-muted)]">
          {errors.password.message}
        </p>
      ) : null}

      <div className="mb-6 flex items-center justify-between text-[12.5px]">
        <label className="flex cursor-pointer items-center gap-[7px] text-[var(--sk-text-muted)]">
          <input
            {...register("remember")}
            type="checkbox"
            className="size-[15px] accent-[var(--sk-gold)]"
          />
          مرا به خاطر بسپار
        </label>
        <a href="#" className="font-medium text-[var(--sk-gold)] no-underline">
          فراموشی رمز؟
        </a>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="h-12 w-full rounded-xl bg-[linear-gradient(180deg,var(--sk-gold-light),var(--sk-gold))] text-[15.5px] font-bold text-[var(--sk-bg)] shadow-[0_8px_20px_rgba(201,162,78,.28)] transition-[filter] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        ورود به سامانه
      </button>
    </form>
  );
}
