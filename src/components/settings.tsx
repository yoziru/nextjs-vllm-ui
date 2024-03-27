"use client";

import dynamic from "next/dynamic";
import ClearChatsButton from "./settings-clear-chats";
import SystemPrompt, { SystemPromptProps } from "./system-prompt";

const SettingsThemeToggle = dynamic(() => import("./settings-theme-toggle"), {
  ssr: false,
});

export default function Settings({
  chatOptions,
  setChatOptions,
}: SystemPromptProps) {
  return (
    <>
      <SettingsThemeToggle />
      <ClearChatsButton />

      <SystemPrompt chatOptions={chatOptions} setChatOptions={setChatOptions} />
    </>
  );
}
