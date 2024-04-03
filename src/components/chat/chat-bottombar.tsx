"use client";

import React from "react";

import { PaperPlaneIcon, StopIcon } from "@radix-ui/react-icons";
import { ChatRequestOptions } from "ai";
import mistralTokenizer from "mistral-tokenizer-js";
import TextareaAutosize from "react-textarea-autosize";


import { tokenLimit } from "@/lib/token-counter";
import { Button } from "../ui/button";

interface ChatBottombarProps {
  selectedModel: string | undefined;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  stop: () => void;
}

export default function ChatBottombar({
  selectedModel,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
}: ChatBottombarProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const hasSelectedModel = selectedModel && selectedModel !== "";

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && hasSelectedModel && !isLoading) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };
  const tokenCount = input ? mistralTokenizer.encode(input).length - 1 : 0;

  return (
    <div>
      <div className="text-xs mt-1 text-muted-foreground w-full text-center">
        <span>Enter to send, Shift + Enter for new line</span>
      </div>
      <div className="p-2 pb-1 flex justify-between w-full items-center ">
        <div key="input" className="w-full relative mb-1 items-center">
          <form
            onSubmit={handleSubmit}
            className="w-full items-center flex relative gap-2"
          >
            <TextareaAutosize
              autoComplete="off"
              value={input}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder="Ask vLLM anything..."
              className="border-input max-h-48 px-4 py-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full border rounded-md flex items-center h-14 resize-none overflow-hidden dark:bg-card/35
            pr-20"
            />
            <div className="text-xs text-muted-foreground w-16 absolute right-16">
              {tokenCount > tokenLimit ? (
                <span className="text-red-700">
                  {tokenCount} token{tokenCount == 1 ? "" : "s"}
                </span>
              ) : (
                <span>
                  {tokenCount} token{tokenCount == 1 ? "" : "s"}
                </span>
              )}
            </div>
            {!isLoading ? (
              <Button
                variant="secondary"
                size="icon"
                type="submit"
                disabled={isLoading || !input.trim() || !hasSelectedModel}
              >
                <PaperPlaneIcon className="w-6 h-6 text-muted-foreground" />
              </Button>
            ) : (
              <Button variant="secondary" size="icon" onClick={stop}>
                <StopIcon className="w-6 h-6  text-muted-foreground" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
