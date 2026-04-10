"use client";

import React, { useEffect } from "react";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotFilledIcon,
  HamburgerMenuIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Message } from "ai/react";
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
import { providerLabels } from "@/lib/llm-providers";
import { Sidebar } from "../sidebar";
import { ChatOptions } from "./chat-options";

interface ChatTopbarProps {
  chatOptions: ChatOptions;
  setChatOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
  isLoading: boolean;
  chatId?: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
}

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
  const provider = chatOptions.provider ?? "vllm";
  const apiBaseUrl = chatOptions.apiBaseUrl;
  const apiKey = chatOptions.apiKey;
  const [tokenLimit, setTokenLimit] = React.useState<number>(4096);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    const currentChatOptions: ChatOptions = {
      provider,
      apiBaseUrl,
      apiKey,
      selectedModel: currentModel,
    };

    const fetchData = async () => {
      try {
        const res = await fetch(basePath + "/api/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatOptions: currentChatOptions }),
        });

        if (!res.ok) {
          const errorResponse = await res.json();
          const errorMessage = `Connection to ${providerLabels[provider]} server failed: ${errorResponse.error} [${res.status} ${res.statusText}]`;
          throw new Error(errorMessage);
        }

        const data = await res.json();
        const modelNames = data.data.map((model: any) => model.id);
        if (modelNames.length > 0 && !modelNames.includes(currentModel)) {
          setChatOptions((prev) => ({ ...prev, selectedModel: modelNames[0] }));
        }
      } catch (error) {
        if (!currentModel) {
          setChatOptions((prev) => ({ ...prev, selectedModel: undefined }));
        }
        toast.error(error instanceof Error ? error.message : String(error));
      }
    };

    fetchData();
    getTokenLimit(basePath, currentChatOptions).then((limit) => setTokenLimit(limit));
  }, [hasMounted, provider, apiBaseUrl, apiKey, currentModel, setChatOptions]);

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
          {currentModel && (
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
          {!currentModel && (
            <>
              <CrossCircledIcon className="w-4 h-4 text-red-500" />
              <span className="text-xs">Connection to {providerLabels[provider]} server failed</span>
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
