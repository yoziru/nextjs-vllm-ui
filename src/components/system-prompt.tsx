import React from "react";

import { MixIcon } from "@radix-ui/react-icons";

import { ChatOptions } from "./chat/chat-options";
import SystemPromptForm from "./system-prompt-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export interface SystemPromptProps {
  chatOptions: ChatOptions;
  setChatOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
}
export default function SystemPrompt({
  chatOptions,
  setChatOptions,
}: SystemPromptProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="justify-start gap-2 w-full"
          size="sm"
          variant="ghost"
        >
          <MixIcon className="w-4 h-4" />
          <p>System Prompt</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <SystemPromptForm
          chatOptions={chatOptions}
          setChatOptions={setChatOptions}
        />
      </DialogContent>
    </Dialog>
  );
}
