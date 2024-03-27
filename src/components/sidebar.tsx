"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SquarePen, Trash2 } from "lucide-react";
import { basePath, cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Message } from "ai/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./sidebar-skeleton";
import Settings from "./settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { DialogClose } from "@radix-ui/react-dialog";
import { ChatOptions } from "./chat/chat-options";

interface SidebarProps {
  isCollapsed: boolean;
  messages: Message[];
  onClick?: () => void;
  isMobile: boolean;
  chatId: string;
  chatOptions: ChatOptions;
  setChatOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
}

interface Chats {
  [key: string]: { chatId: string; messages: Message[] }[];
}

export function Sidebar({
  messages,
  isCollapsed,
  isMobile,
  chatId,
  chatOptions,
  setChatOptions,
}: SidebarProps) {
  const [localChats, setLocalChats] = useState<Chats>({});
  const router = useRouter();
  const [selectedChatId, setSselectedChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (chatId) {
      setSselectedChatId(chatId);
    }

    setLocalChats(getLocalstorageChats());
    const handleStorageChange = () => {
      setLocalChats(getLocalstorageChats());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [chatId]);

  const getLocalstorageChats = (): Chats => {
    const chats = Object.keys(localStorage).filter((key) =>
      key.startsWith("chat_")
    );

    if (chats.length === 0) {
      setIsLoading(false);
    }

    // Map through the chats and return an object with chatId and messages
    const chatObjects = chats.map((chat) => {
      const item = localStorage.getItem(chat);
      return item
        ? { chatId: chat, messages: JSON.parse(item) }
        : { chatId: "", messages: [] };
    });

    // Sort chats by the createdAt date of the first message of each chat
    chatObjects.sort((a, b) => {
      const aDate = new Date(a.messages[0].createdAt);
      const bDate = new Date(b.messages[0].createdAt);
      return bDate.getTime() - aDate.getTime();
    });

    const groupChatsByDate = (
      chats: { chatId: string; messages: Message[] }[]
    ) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const groupedChats: Chats = {};

      chats.forEach((chat) => {
        const createdAt = new Date(chat.messages[0].createdAt ?? "");
        const diffInDays = Math.floor(
          (today.getTime() - createdAt.getTime()) / (1000 * 3600 * 24)
        );

        let group: string;
        if (diffInDays === 0) {
          group = "Today";
        } else if (diffInDays === 1) {
          group = "Yesterday";
        } else if (diffInDays <= 7) {
          group = "Previous 7 Days";
        } else if (diffInDays <= 30) {
          group = "Previous 30 Days";
        } else {
          group = "Older";
        }

        if (!groupedChats[group]) {
          groupedChats[group] = [];
        }
        groupedChats[group].push(chat);
      });

      return groupedChats;
    };

    setIsLoading(false);
    const groupedChats = groupChatsByDate(chatObjects);

    return groupedChats;
    // return chatObjects;
  };

  const handleDeleteChat = (chatId: string) => {
    localStorage.removeItem(chatId);
    setLocalChats(getLocalstorageChats());
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 overflow-y-auto
      "
    >
      <div className="sticky left-0 right-0 top-0 z-20 p-1 lg:bg-card">
        <Button
          onClick={() => {
            router.push("/");
            // Clear messages
            messages.splice(0, messages.length);
          }}
          variant="ghost"
          className="flex justify-between w-full h-10 text-sm xl:text-md font-medium items-center "
        >
          <div className="flex gap-3 items-center">
            {!isCollapsed && !isMobile && (
              <Image
                src={basePath + "/ollama.png"}
                alt="AI"
                width={28}
                height={28}
                className="dark:invert hidden 2xl:block"
              />
            )}
            New chat
          </div>
          <SquarePen size={18} className="shrink-0 w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 flex-col gap-2 pb-2 text-sm">
        {Object.keys(localChats).length > 0 && (
          <div>
            {Object.keys(localChats).map((group, index) => (
              <div key={index} className="flex flex-col gap-2">
                <p className="h-9 pb-4 pt-8 px-2 text-xs font-medium text-muted-foreground">
                  {group}
                </p>
                <ol>
                  {localChats[group].map(({ chatId, messages }, chatIndex) => (
                    <li className="flex w-full gap-0 items-center relative" key={chatIndex}>
                      <div className="flex-col w-full truncate">
                        <Link
                          href={`/chats/${chatId.substring(5)}`}
                          className={cn(
                            {
                              [buttonVariants({ variant: "secondaryLink" })]:
                                chatId.substring(5) === selectedChatId,
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
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader className="space-y-4">
                              <DialogTitle>Delete chat?</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this chat? This
                                action cannot be undone.
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
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
        {isLoading && <SidebarSkeleton />}
      </div>

      <div className="sticky left-0 right-0 bottom-0 z-20 p-1 lg:bg-card">
        <Settings chatOptions={chatOptions} setChatOptions={setChatOptions} />
      </div>
    </div>
  );
}
