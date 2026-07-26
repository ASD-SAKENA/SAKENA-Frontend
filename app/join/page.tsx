import { Suspense } from "react";

import { JoinScreen } from "@/components/invitations/join-screen";

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinScreen />
    </Suspense>
  );
}
