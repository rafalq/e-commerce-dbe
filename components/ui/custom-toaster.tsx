"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function CustomToaster() {
  const { theme } = useTheme();

  if (typeof theme === "string") {
    return (
      <Toaster
        richColors
        theme={theme as "light" | "dark" | "system" | undefined}
        expand={true}
        closeButton
      />
    );
  }
}
