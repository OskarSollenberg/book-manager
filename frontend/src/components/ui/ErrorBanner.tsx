import type { ReactNode } from "react";

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger-border bg-danger-soft px-3 py-2.5 text-sm text-danger"
    >
      {children}
    </div>
  );
}
