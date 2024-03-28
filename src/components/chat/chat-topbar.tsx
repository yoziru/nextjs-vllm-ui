"use client";

import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  HamburgerMenuIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  DotFilledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";
import { ChatOptions } from "./chat-options";
import { basePath, useHasMounted } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ChatTopbarProps {
  chatOptions: ChatOptions;
  setChatOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
}

export default function ChatTopbar({
  chatOptions,
  setChatOptions,
  isLoading,
  chatId,
  messages,
}: ChatTopbarProps) {
  const hasMounted = useHasMounted();

  const currentModel = chatOptions && chatOptions.selectedModel;

  const fetchData = async () => {
    try {
      const res = await fetch(basePath + "/api/models", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "cache-control": "no-cache",
        },
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        const errorMessage = `Connection to vLLM server failed: ${errorResponse.error} [${res.status} ${res.statusText}]`;
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await res.json();
      // Extract the "name" field from each model object and store them in the state
      const modelNames = data.data.map((model: any) => model.id);
      // save the first and only model in the list as selectedModel in localstorage
      setChatOptions({ ...chatOptions, selectedModel: modelNames[0] });
    } catch (error) {
      setChatOptions({ ...chatOptions, selectedModel: undefined });
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!hasMounted) {
    return (
      <div className="w-full flex px-4 py-6 items-center gap-1 lg:justify-center">
        <DotFilledIcon className="w-4 h-4 text-blue-500" />
        <span className="text-xs">Booting up..</span>
      </div>
    );
  }

  return (
    <div className="w-full flex px-4 py-6 items-center justify-between lg:justify-center">
      <Sheet>
        <SheetTrigger>
          <HamburgerMenuIcon className="lg:hidden w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left">
          <Sidebar
            chatId={chatId || ""}
            isCollapsed={false}
            isMobile={false}
            messages={messages}
            chatOptions={chatOptions}
            setChatOptions={setChatOptions}
          />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-4">
        <div className="w-full gap-1 flex justify-between items-center">
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
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-xs text-xs"
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
              <span className="text-xs">Connection to vLLM server failed</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
