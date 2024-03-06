import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { MixIcon } from "@radix-ui/react-icons";
import SystemPromptForm from "./system-prompt-form";
import { ChatOptions } from "./chat/chat-options";
export interface SystemPromptProps {
  chatOptions: ChatOptions;
  setChatOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
}
export default function SystemPrompt({
  chatOptions,
  setChatOptions,
}: SystemPromptProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-[160px] gap-2 p-1 items-center cursor-pointer rounded-md border">
          <MixIcon className="w-4 h-4" />
          <p>System Prompt</p>
        </div>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <DialogTitle>Save system prompt</DialogTitle>
        <SystemPromptForm
          chatOptions={chatOptions}
          setChatOptions={setChatOptions}
        />
      </DialogContent>
    </Dialog>
  );
}
