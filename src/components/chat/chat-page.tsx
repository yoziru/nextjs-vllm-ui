"use client";

import React from "react";

import { ChatRequestOptions, DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";

import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatOptions } from "@/components/chat/chat-options";
import { basePath } from "@/lib/utils";

interface ChatPageProps {
  chatId: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
}

const defaultChatOptions: ChatOptions = {
  selectedModel: "",
  systemPrompt: "",
  temperature: 0.9,
};

const getStoredChatOptions = (): ChatOptions => {
  if (typeof window === "undefined") {
    return defaultChatOptions;
  }

  const stored = window.localStorage.getItem("chatOptions");
  return stored ? JSON.parse(stored) : defaultChatOptions;
};

export default function ChatPage({ chatId, setChatId }: ChatPageProps) {
  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: basePath + "/api/chat",
    }),
    onError: (error) => {
      toast.error("Something went wrong: " + error);
    },
  });
  const [input, setInput] = React.useState("");
  const isLoading = status === "submitted" || status === "streaming";
  const [chatOptions, setChatOptions] =
    React.useState<ChatOptions>(getStoredChatOptions);

  React.useEffect(() => {
    window.localStorage.setItem("chatOptions", JSON.stringify(chatOptions));
  }, [chatOptions]);

  React.useEffect(() => {
    if (chatId) {
      const item = localStorage.getItem(`chat_${chatId}`);
      if (item) {
        setMessages(JSON.parse(item));
      }
    } else {
      setMessages([]);
    }
  }, [setMessages, chatId]);

  React.useEffect(() => {
    if (!isLoading && !error && chatId && messages.length > 0) {
      // Save messages to local storage
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
  }, [messages, chatId, isLoading, error]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (messages.length === 0) {
      // Generate a random id for the chat
      const id = crypto.randomUUID();
      setChatId(id);
    }

    setMessages([...messages]);

    // Prepare the options object with additional body data, to pass the model.
    const requestOptions: ChatRequestOptions = {
      body: {
        chatOptions: chatOptions,
      },
    };

    sendMessage({ text: input }, requestOptions);
    setInput("");
  };

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      <ChatLayout
        chatId={chatId}
        setChatId={setChatId}
        chatOptions={chatOptions}
        setChatOptions={setChatOptions}
        messages={messages}
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        stop={stop}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
      />
    </main>
  );
}
