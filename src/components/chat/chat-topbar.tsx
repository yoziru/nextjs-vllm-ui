"use client";

import React, { useEffect } from "react";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotFilledIcon,
  HamburgerMenuIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { toast } from "sonner";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { encodeChat, getTokenLimit } from "@/lib/token-counter";
import { basePath, useHasMounted } from "@/lib/utils";
import { ChatMessage } from "@/lib/chat-message";
import { Sidebar } from "../sidebar";
import { ChatOptions } from "./chat-options";

interface ChatTopbarProps {
  chatOptions: ChatOptions;
  setChatOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
  isLoading: boolean;
  chatId?: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  messages: ChatMessage[];
}

const getConnectionHelpText = (message: string | undefined) => {
  if (message === "VLLM_URL is not set") {
    return "Set VLLM_URL in .env and restart the app";
  }

  return message ?? "Connection to vLLM server failed";
};

export default function ChatTopbar({
  chatOptions,
  setChatOptions,
  isLoading,
  chatId,
  setChatId,
  messages,
}: ChatTopbarProps) {
  const hasMounted = useHasMounted();

  const currentModel = chatOptions && chatOptions.selectedModel;
  const [tokenLimit, setTokenLimit] = React.useState<number>(4096);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const fetchData = React.useCallback(async () => {
    if (!hasMounted) {
      return;
    }

    try {
      const res = await fetch(basePath + "/api/models");

      if (!res.ok) {
        const errorResponse = await res.json();
        const errorMessage = `Connection to vLLM server failed: ${errorResponse.error} [${res.status} ${res.statusText}]`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      if (!Array.isArray(data.data) || data.data.length === 0) {
        throw new Error("No models available from vLLM server");
      }

      const modelNames = data.data
        .map((model: { id?: unknown }) => model.id)
        .filter(
          (id: unknown): id is string => typeof id === "string" && id !== ""
        );

      if (modelNames.length === 0) {
        throw new Error("No usable model IDs returned from vLLM server");
      }

      setChatOptions((options) => ({
        ...options,
        selectedModel: modelNames[0],
      }));
      setError(undefined);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setChatOptions((options) => ({ ...options, selectedModel: undefined }));
      setError(errorMessage);
      toast.error(getConnectionHelpText(errorMessage));
    }
  }, [hasMounted, setChatOptions]);

  useEffect(() => {
    fetchData();
    getTokenLimit(basePath).then((limit) => setTokenLimit(limit));
  }, [fetchData]);

  if (!hasMounted) {
    return (
      <div className="md:w-full flex px-4 py-6 items-center gap-1 md:justify-center">
        <DotFilledIcon className="w-4 h-4 text-blue-500" />
        <span className="text-xs">Booting up..</span>
      </div>
    );
  }

  const chatTokens = messages.length > 0 ? encodeChat(messages) : 0;

  return (
    <div className="md:w-full flex px-4 py-4 items-center justify-between md:justify-center">
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center gap-2">
            <HamburgerMenuIcon className="md:hidden w-5 h-5" />
          </div>
        </SheetTrigger>
        <SheetContent side="left">
          <div>
            <Sidebar
              chatId={chatId || ""}
              setChatId={setChatId}
              isCollapsed={false}
              isMobile={false}
              chatOptions={chatOptions}
              setChatOptions={setChatOptions}
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex justify-center md:justify-between gap-4 w-full">
        <div className="gap-1 flex items-center">
          {currentModel !== undefined && (
            <>
              {isLoading ? (
                <DotFilledIcon className="w-4 h-4 text-blue-500" />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="cursor-help">
                        <CheckCircledIcon className="w-4 h-4 text-green-500" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      sideOffset={4}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-sm text-xs"
                    >
                      <p className="font-bold">Current Model</p>
                      <p className="text-gray-500">{currentModel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <span className="text-xs">
                {isLoading ? "Generating.." : "Ready"}
              </span>
            </>
          )}
          {currentModel === undefined && (
            <>
              <CrossCircledIcon className="w-4 h-4 text-red-500" />
              <span className="text-xs">{getConnectionHelpText(error)}</span>
            </>
          )}
        </div>
        <div className="flex items-end gap-2">
          {chatTokens > tokenLimit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span>
                    <InfoCircledIcon className="w-4 h-4 text-blue-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={4}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-sm text-xs"
                >
                  <p className="text-gray-500">
                    Token limit exceeded. Truncating middle messages.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {messages.length > 0 && (
            <span className="text-xs text-gray-500">
              {chatTokens} / {tokenLimit} token{chatTokens > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
