"use client";

import React, { useEffect, useState } from "react";

import { Sidebar } from "../sidebar";
import Chat, { ChatProps, ChatTopbarProps } from "./chat";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  chatId: string;
}

type MergedProps = ChatLayoutProps & ChatProps & ChatTopbarProps;

export function ChatLayout({
  defaultLayout = [30, 160],
  defaultCollapsed = false,
  navCollapsedSize = 768,
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
  chatId,
  setChatId,
  chatOptions,
  setChatOptions,
}: MergedProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsCollapsed(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <div className="relative z-0 flex h-full w-full overflow-hidden">
      <div className="flex-shrink-0 overflow-x-hidden bg-token-sidebar-surface-primary md:w-[260px]">
        <Sidebar
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          chatId={chatId}
          setChatId={setChatId}
          chatOptions={chatOptions}
          setChatOptions={setChatOptions}
        />
      </div>
      <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
        <Chat
          chatId={chatId}
          setChatId={setChatId}
          chatOptions={chatOptions}
          setChatOptions={setChatOptions}
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          stop={stop}
        />
      </div>
    </div>
  );
}
