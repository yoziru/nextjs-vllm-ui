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
import { encodeChat, getAppSettings } from "@/lib/token-counter";
import { LlmProvider, LLM_PROVIDERS, providerLabels } from "@/lib/llm-providers";
import { basePath, useHasMounted } from "@/lib/utils";
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

  const currentProvider = chatOptions?.provider;
  const currentModel = chatOptions && chatOptions.selectedModel;
  const [tokenLimit, setTokenLimit] = React.useState<number>(4096);
  const [activeProvider, setActiveProvider] = React.useState<string>("vllm");
  const [providerLabel, setProviderLabel] = React.useState<string>("Model");

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    const currentChatOptions: ChatOptions = {
      provider: currentProvider,
      selectedModel: currentModel,
    };

    const fetchData = async () => {
      try {
        const [res, settings] = await Promise.all([
          fetch(basePath + "/api/models", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatOptions: currentChatOptions }),
          }),
          getAppSettings(basePath, currentChatOptions),
        ]);

        // Update active provider metadata even when model listing is unavailable.
        setProviderLabel(settings.providerLabel);
        setActiveProvider(settings.provider);

        if (!res.ok) {
          // Osirus can work without an explicit model list/model id.
          if (settings.provider === "osirus") {
            return;
          }

          const errorResponse = await res.json();
          const errorMessage = `Connection to ${settings.providerLabel} server failed: ${errorResponse.error} [${res.status} ${res.statusText}]`;
          throw new Error(errorMessage);
        }
        setTokenLimit(settings.tokenLimit);

        const data = await res.json();
        const modelNames = Array.isArray(data?.data)
          ? data.data.map((model: any) => model.id)
          : [];
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
  }, [hasMounted, currentProvider, currentModel, setChatOptions]);

  if (!hasMounted) {
    return (
      <div className="md:w-full flex px-4 py-6 items-center gap-1 md:justify-center">
        <DotFilledIcon className="w-4 h-4 text-blue-500" />
        <span className="text-xs">Booting up..</span>
      </div>
    );
  }

  const chatTokens = messages.length > 0 ? encodeChat(messages) : 0;
  const providerRequiresModel = activeProvider !== "osirus";
  const isProviderReady = !providerRequiresModel || Boolean(currentModel);

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
          <select
            className="h-7 text-xs rounded-sm border border-input bg-background px-2 mr-2"
            value={currentProvider || activeProvider}
            onChange={(e) =>
              setChatOptions((prev) => ({
                ...prev,
                provider: (e.target.value || undefined) as LlmProvider | undefined,
                selectedModel: undefined,
              }))
            }
            title="Provider"
          >
            <option value="">Default</option>
            {LLM_PROVIDERS.map((provider) => (
              <option key={provider} value={provider}>
                {providerLabels[provider]}
              </option>
            ))}
          </select>
          {isProviderReady && (
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
                      <p className="text-gray-500">{currentModel || "Provider-managed"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <span className="text-xs">
                {isLoading ? "Generating.." : "Ready"}
              </span>
            </>
          )}
          {!isProviderReady && (
            <>
              <CrossCircledIcon className="w-4 h-4 text-red-500" />
              <span className="text-xs">Connection to {providerLabel} server failed</span>
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
