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
      <SystemPrompt chatOptions={chatOptions} setChatOptions={setChatOptions} />
      <SettingsThemeToggle />
      <ClearChatsButton />
    </>
  );
}
