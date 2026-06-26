import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getLandingContent, landingKeys } from "@/api/landing";

import { getQueryClient } from "@/lib/query-client";

import { LandingContent } from "./components/landing-content";

export default async function LandingPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: landingKeys.content,
    queryFn: getLandingContent,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingContent />
    </HydrationBoundary>
  );
}
