"use client";

import { useMutation } from "@tanstack/react-query";

import { forgotPassword, login, resetPassword, signup } from "@/api/auth";

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: signup,
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => resetPassword(token, newPassword),
  });
}
