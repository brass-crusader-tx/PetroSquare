import type { ReactNode } from "react";
import { AppLayout } from "@petrosquare/ui";

export default function ModulesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
