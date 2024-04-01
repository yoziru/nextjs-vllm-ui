"use client";

import React from "react";

import { DialogClose } from "@radix-ui/react-dialog";
import { ChatBubbleIcon, GearIcon, TrashIcon } from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import { Message } from "ai/react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatOptions } from "./chat/chat-options";
import Settings from "./settings";
import SidebarSkeleton from "./sidebar-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Chats {
  [key: string]: { chatId: string; messages: Message[] }[];
}
interface SidebarTabsProps {
  isLoading: boolean;
  localChats: Chats;
  selectedChatId: string | null;
  chatOptions: ChatOptions;
  setChatOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
  handleDeleteChat: (chatId: string) => void;
}

const SidebarTabs = ({
  localChats,
  selectedChatId,
  isLoading,
  chatOptions,
  setChatOptions,
  handleDeleteChat,
}: SidebarTabsProps) => (
  <Tabs.Root className="TabsRoot" defaultValue="chats">
    <div className="flex-1 flex-col gap-2 text-sm m-2 h-full overflow-y-auto">
      <Tabs.Content className="TabsContent" value="chats">
        <>
          {Object.keys(localChats).length > 0 && (
            <div>
              {Object.keys(localChats).map((group, index) => (
                <div key={index} className="flex flex-col gap-2 pb-8">
                  <p className="px-2 text-xs font-medium text-muted-foreground">
                    {group}
                  </p>
                  <ol>
                    {localChats[group].map(
                      ({ chatId, messages }, chatIndex) => (
                        <li
                          className="flex w-full gap-0 items-center relative"
                          key={chatIndex}
                        >
                          <div className="flex-col w-full truncate">
                            <Link
                              href={`/chats/${chatId.substring(5)}`}
                              className={cn(
                                {
                                  [buttonVariants({
                                    variant: "secondaryLink",
                                  })]: chatId.substring(5) === selectedChatId,
                                  [buttonVariants({ variant: "ghost" })]:
                                    chatId.substring(5) !== selectedChatId,
                                },
                                "flex gap-2 p-2 justify-start "
                              )}
                            >
                              <span className="text-xs font-normal">
                                {messages.length > 0 ? messages[0].content : ""}
                              </span>
                            </Link>
                          </div>
                          <div className="flex-col">
                            <Dialog>
                              <DialogTrigger>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="hover:text-red-500"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader className="space-y-4">
                                  <DialogTitle>Delete chat?</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this chat?
                                    This action cannot be undone.
                                  </DialogDescription>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">
                                      <DialogClose>Cancel</DialogClose>
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDeleteChat(chatId)}
                                    >
                                      <DialogClose>Delete</DialogClose>
                                    </Button>
                                  </div>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </li>
                      )
                    )}
                  </ol>
                </div>
              ))}
            </div>
          )}
          {isLoading && <SidebarSkeleton />}
        </>
      </Tabs.Content>
      <Tabs.Content className="TabsContent" value="settings">
        <Settings chatOptions={chatOptions} setChatOptions={setChatOptions} />
      </Tabs.Content>
    </div>
    <div className="sticky left-0 right-0 bottom-0 z-20 py-2 m-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-card">
      <Tabs.List
        className="flex flex-wrap -mb-px text-sm font-medium text-center justify-center gap-2"
        aria-label="Navigation"
      >
        <Tabs.Trigger
          className="p-4 rounded-sm data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700"
          value="chats"
        >
          <ChatBubbleIcon className="w-5 h-5" />
          {/* <span className="text-xs">Chats</span> */}
        </Tabs.Trigger>
        <Tabs.Trigger
          className=" p-4 rounded-sm data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700"
          value="settings"
        >
          <GearIcon className="w-5 h-5" />
          {/* <span className="text-xs">Settings</span> */}
        </Tabs.Trigger>
      </Tabs.List>
    </div>
  </Tabs.Root>
);

export default SidebarTabs;
