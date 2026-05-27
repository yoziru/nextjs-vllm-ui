"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { toast } from "sonner";

import { useHasMounted } from "@/lib/utils";
import { ChatOptions } from "./chat/chat-options";
import { Textarea } from "./ui/textarea";

export interface SystemPromptProps {
  chatOptions: ChatOptions;
  setChatOptions: Dispatch<SetStateAction<ChatOptions>>;
}
export default function SystemPrompt({
  chatOptions,
  setChatOptions,
}: SystemPromptProps) {
  const hasMounted = useHasMounted();

  const systemPrompt = chatOptions ? chatOptions.systemPrompt : "";
  const [text, setText] = useState<string>(systemPrompt || "");

  useEffect(() => {
    if (!hasMounted) {
      return;
    }
    if (text === systemPrompt) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setChatOptions({ ...chatOptions, systemPrompt: text });
      toast.success("System prompt updated", { duration: 1000 });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [hasMounted, text, systemPrompt, chatOptions, setChatOptions]);

  return (
    <div>
      <div className="justify-start gap-2 w-full rounded-sm px-2 text-xs">
        <p>System prompt</p>
      </div>

      <div className="m-2">
        <Textarea
          className="resize-none bg-white/20 dark:bg-card/35"
          autoComplete="off"
          rows={7}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          name="systemPrompt"
          placeholder="You are a helpful assistant."
        />
      </div>
    </div>
  );
}
