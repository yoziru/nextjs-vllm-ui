import React, { useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MixIcon } from "@radix-ui/react-icons";
import SystemPromptForm from "./system-prompt-form";

export default function SystemPrompt() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
          <MixIcon className="w-4 h-4" />
          <p>System Prompt</p>
        </div>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <DialogTitle>Pull Model</DialogTitle>
        <SystemPromptForm />
      </DialogContent>
    </Dialog>
  );
}
