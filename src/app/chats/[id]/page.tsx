"use client";

import React from "react";
import { use } from "react";

import ChatPage from "@/components/chat/chat-page";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [chatId, setChatId] = React.useState<string>("");

  React.useEffect(() => {
    if (id) {
      setChatId(id);
    }
  }, [id]);

  return <ChatPage chatId={chatId} setChatId={setChatId} />;
}
