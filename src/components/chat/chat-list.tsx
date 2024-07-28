import React, { useEffect, useRef } from "react";

import Image from "next/image";

import OllamaLogo from "../../../public/ollama.png";
import CodeDisplayBlock from "../code-display-block";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "ai";

interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageToolbar = () => (
  <div className="mt-1 flex gap-3 empty:hidden juice:flex-row-reverse">
    <div className="text-gray-400 flex self-end lg:self-center items-center justify-center lg:justify-start mt-0 -ml-1 h-7 gap-[2px] invisible">
      <span>Regenerate</span>
      <span>Edit</span>
    </div>
  </div>
);

export default function ChatList({ messages, isLoading }: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    // if user scrolls up, disable auto-scroll
    scrollToBottom();
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col gap-4 items-center">
          <Image
            src={OllamaLogo}
            alt="AI"
            width={60}
            height={60}
            className="h-20 w-14 object-contain dark:invert"
          />
          <p className="text-center text-xl text-muted-foreground">
            How can I help you today?
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="scroller"
      className="w-[800px] overflow-y-scroll overflow-x-hidden h-full justify-center m-auto"
    >
      <div className="px-4 py-2 justify-center text-base md:gap-6 m-auto">
        {messages
          .filter((message) => message.role !== "system")
          .map((message, index) => (
            <div
              key={index}
              className="flex flex-1 text-base mx-auto gap-3 juice:gap-4 juice:md:gap-6 md:px-5 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"
            >
              <div className="flex flex-1 text-base mx-auto gap-3 juice:gap-4 juice:md:gap-6 md:px-5 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
                <div className="flex-shrink-0 flex flex-col relative items-end">
                  <div className="pt-0.5">
                    <div className="gizmo-shadow-stroke flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                      {message.role === "user" ? (
                        <div className="dark:invert h-full w-full bg-black" />
                      ) : (
                        <Image
                          src={OllamaLogo}
                          alt="AI"
                          className="object-contain dark:invert aspect-square h-full w-full"
                        />
                      )}
                    </div>
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="relative flex w-full min-w-0 flex-col">
                    <div className="font-semibold pb-2">You</div>
                    <div className="flex-col gap-1 md:gap-3">
                      {message.content}
                    </div>
                    <MessageToolbar />
                  </div>
                )}
                {message.role === "assistant" && (
                  <div className="relative flex w-full min-w-0 flex-col">
                    <div className="font-semibold pb-2">Assistant</div>
                    <div className="flex-col gap-1 md:gap-3">
                      <span className="whitespace-pre-wrap">
                        {/* Check if the message content contains a code block */}
                        {message.content.split("```").map((part, index) => {
                          if (index % 2 === 0) {
                            return (
                              <Markdown key={index} remarkPlugins={[remarkGfm]}>
                                {part}
                              </Markdown>
                            );
                          } else {
                            return (
                              <CodeDisplayBlock
                                key={index}
                                code={part.trim()}
                                lang=""
                              />
                            );
                          }
                        })}
                        {isLoading &&
                          messages.indexOf(message) === messages.length - 1 && (
                            <span className="animate-pulse" aria-label="Typing">
                              ...
                            </span>
                          )}
                      </span>
                    </div>
                    <MessageToolbar />
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}
