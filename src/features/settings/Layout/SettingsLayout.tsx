import type { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
