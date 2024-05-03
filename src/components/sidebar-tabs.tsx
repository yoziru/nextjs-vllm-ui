"use client";

import React from "react";

import { DialogClose } from "@radix-ui/react-dialog";
import { ChatBubbleIcon, GearIcon, TrashIcon } from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import { Message } from "ai/react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
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
  selectedChatId: string;
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
  <Tabs.Root
    className="overflow-hidden h-full bg-accent/20 dark:bg-card/35"
    defaultValue="chats"
  >
    <div className=" text-sm o h-full">
      <Tabs.Content className="h-screen overflow-y-auto" value="chats">
        <div className="h-full mb-28">
          {Object.keys(localChats).length > 0 && (
            <>
              {Object.keys(localChats).map((group, index) => (
                <div key={index} className="flex flex-col py-2 pl-3 pr-1 gap-2 mb-8">
                  <p className="px-2 text-xs font-medium text-muted-foreground">
                    {group}
                  </p>
                  <ol>
                    {localChats[group].map(
                      ({ chatId, messages }, chatIndex) => {
                        const isSelected =
                          chatId.substring(5) === selectedChatId;
                        return (
                          <li
                            className="flex w-full items-center relative"
                            key={chatIndex}
                          >
                            <div className="flex-col w-full truncate">
                              <Link
                                href={`/chats/${chatId.substring(5)}`}
                                className={cn(
                                  {
                                    [buttonVariants({
                                      variant: "secondaryLink",
                                    })]: isSelected,
                                    [buttonVariants({ variant: "ghost" })]:
                                      !isSelected,
                                  },
                                  "flex gap-2 p-2 justify-start"
                                )}
                              >
                                <span className="text-sm font-normal max-w-[184px] truncate">
                                  {messages.length > 0
                                    ? messages[0].content
                                    : ""}
                                </span>
                              </Link>
                            </div>
                            <div className="absolute right-0 rounded-xs">
                              <Dialog>
                                <DialogTrigger
                                  className={
                                    "items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  h-8 rounded-sm px-3 text-xs justify-start gap-2 w-full hover:text-red-500 hover:bg-card dark:hover:bg-accent" +
                                    (isSelected
                                      ? " bg-accent dark:bg-card"
                                      : " ")
                                  }
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader className="space-y-4">
                                    <DialogTitle>Delete chat?</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this chat?
                                      This action cannot be undone.
                                    </DialogDescription>
                                    <div className="flex justify-end gap-2">
                                      <DialogClose className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-sm">
                                        Cancel
                                      </DialogClose>

                                      <DialogClose
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-sm"
                                        onClick={() => handleDeleteChat(chatId)}
                                      >
                                        Delete
                                      </DialogClose>
                                    </div>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ol>
                </div>
              ))}
            </>
          )}
          {isLoading && <SidebarSkeleton />}
        </div>
      </Tabs.Content>
      <Tabs.Content className="h-screen overflow-y-auto" value="settings">
        <div className="h-full mb-16 pl-2">
          <Settings chatOptions={chatOptions} setChatOptions={setChatOptions} />
        </div>
      </Tabs.Content>
    </div>
    <div className="sticky left-0 right-0 bottom-0 z-20  m-0 overflow-hidden">
      <Tabs.List
        className="flex flex-wrap -mb-px py-2 text-sm font-medium text-center justify-center gap-2 bg-accent dark:bg-card"
        aria-label="Navigation"
      >
        <Tabs.Trigger
          className="inline-flex items-center justify-center p-0.5 rounded-sm data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700 h-10 w-10"
          value="chats"
        >
          <ChatBubbleIcon className="w-5 h-5" />
          {/* <span className="text-xs">Chats</span> */}
        </Tabs.Trigger>
        <Tabs.Trigger
          className="inline-flex items-center justify-center p-0.5 rounded-sm data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700 h-10 w-10"
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
