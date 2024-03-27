"use client";

import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  HamburgerMenuIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";
import { ChatOptions } from "./chat-options";
import { basePath } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
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
  const currentModel = chatOptions && chatOptions.selectedModel;

  const handleModelChange = (model: string | undefined) => {
    setChatOptions({ ...chatOptions, selectedModel: model });
  };

  useEffect(() => {
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
          throw new Error(res.status + " " + res.statusText);
        }

        const data = await res.json();
        // Extract the "name" field from each model object and store them in the state
        const modelNames = data.data.map((model: any) => model.id);
        // save the first and only model in the list as selectedModel in localstorage
        handleModelChange(modelNames[0]);
      } catch (error) {
        handleModelChange(undefined);
        toast.error("Connection to vLLM server failed: " + error);
      }
    };
    fetchData();
  }, [chatOptions, setChatOptions, handleModelChange]);

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
                <LoaderCircle className="w-4 h-4 text-blue-500" />
              ) : (
                <CheckCircledIcon className="w-4 h-4 text-green-500" />
              )}
              <span className="text-xs">
                {isLoading ? "Generating.." : "Connected to vLLM server"}
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
