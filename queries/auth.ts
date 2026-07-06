"use client";

import { useMutation } from "@tanstack/react-query";

import { login, signup } from "@/api/auth";

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
