"use client";

import * as React from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useHasMounted } from "@/lib/utils";

export default function SettingsThemeToggle() {
  const hasMounted = useHasMounted();
  const { setTheme, theme } = useTheme();

  if (!hasMounted) {
    return null;
  }

  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <Button
      className="justify-start gap-2 w-full"
      size="sm"
      variant="ghost"
      onClick={() => setTheme(nextTheme)}
    >
      {nextTheme === "light" ? (
        <SunIcon className="w-4 h-4" />
        ) : (
        <MoonIcon className="w-4 h-4" />
      )}
      <p>{nextTheme === "light" ? "Light mode" : "Dark mode"}</p>
    </Button>
  );
}
