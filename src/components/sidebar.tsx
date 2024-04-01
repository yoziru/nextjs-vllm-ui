"use client";
import { useEffect, useState } from "react";

import { Pencil2Icon } from "@radix-ui/react-icons";
import { Message } from "ai/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import OllamaLogo from "../../public/ollama.png";
import { ChatOptions } from "./chat/chat-options";
import SidebarTabs from "./sidebar-tabs";

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
      className="relative justify-between group lg:bg- accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 data-[collapsed=true]:p-0"
    >
      <div className="sticky left-0 right-0 top-0 z-20 p-1 rounded-sm m-2">
        <Button
          onClick={() => {
            router.push("/new");
          }}
          variant="outline"
          className="flex justify-between w-full h-10 text-sm font-medium items-center"
        >
          <div className="flex gap-3 items-center">
            {!isCollapsed && !isMobile && (
              <Image
                src={OllamaLogo}
                alt="AI"
                width={14}
                height={14}
                className="dark:invert 2xl:block"
              />
            )}
            New chat
          </div>
          <Pencil2Icon className="shrink-0 w-4 h-4" />
        </Button>
      </div>
      <SidebarTabs
        isLoading={isLoading}
        localChats={localChats}
        selectedChatId={selectedChatId}
        chatOptions={chatOptions}
        setChatOptions={setChatOptions}
        handleDeleteChat={handleDeleteChat}
      />
    </div>
  );
}
