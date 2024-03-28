"use client";

import ClearChatsButton from "./settings-clear-chats";
import SettingsThemeToggle from "./settings-theme-toggle";
import SystemPrompt, { SystemPromptProps } from "./system-prompt";

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
