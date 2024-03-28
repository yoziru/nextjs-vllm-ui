"use client";

import ClearChatsButton from "./settings-clear-chats";
import SystemPrompt, { SystemPromptProps } from "./system-prompt";
import SettingsThemeToggle from "./settings-theme-toggle";

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
