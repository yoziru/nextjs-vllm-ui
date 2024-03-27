import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { MixIcon } from "@radix-ui/react-icons";
import SystemPromptForm from "./system-prompt-form";
import { ChatOptions } from "./chat/chat-options";
import { Button } from "./ui/button";
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
        <DialogTitle>Save system prompt</DialogTitle>
        <SystemPromptForm
          chatOptions={chatOptions}
          setChatOptions={setChatOptions}
        />
      </DialogContent>
    </Dialog>
  );
}
