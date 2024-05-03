"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { toast } from "sonner";
import { useDebounce } from "use-debounce";

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
  const [debouncedText] = useDebounce(text, 500);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }
    if (debouncedText !== systemPrompt) {
      setChatOptions({ ...chatOptions, systemPrompt: debouncedText });
      toast.success("System prompt updated", { duration: 1000 });
    }
  }, [hasMounted, debouncedText]);

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
