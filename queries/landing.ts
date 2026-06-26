"use client";

import { useQuery } from "@tanstack/react-query";

import { getLandingContent, landingKeys } from "@/api/landing";

export function useLandingContentQuery() {
  return useQuery({
    queryKey: landingKeys.content,
    queryFn: getLandingContent,
    staleTime: 60 * 60 * 1000,
  });
}
