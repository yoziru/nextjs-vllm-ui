import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChatProps } from "./chat";
import CodeDisplayBlock from "../code-display-block";
import OllamaLogo from "../../../public/ollama.png";

export default function ChatList({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
}: ChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          <p className="text-center text-lg text-muted-foreground">
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
      <div className="flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end">
        {messages
          .filter((message) => message.role !== "system")
          .map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.role === "user" ? "items-start" : "items-start"
              )}
            >
              <div className="flex gap-3 items-center">
                {message.role === "user" && (
                  <div>
                    <div className="font-semibold pb-2">You</div>
                    <div className="bg-accent gap-1 p-2 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                      {message.content}
                    </div>
                  </div>
                )}
                {message.role === "assistant" && (
                  <div className="flex items-end gap-2">
                    <div className="flex justify-start items-center mt-0 mb-auto relative h-10 w-10 shrink-0 overflow-hidden">
                      <Image
                        src={OllamaLogo}
                        alt="AI"
                        className="object-contain dark:invert aspect-square h-full w-full"
                      />
                    </div>
                    <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                      {/* Check if the message content contains a code block */}
                      {message.content.split("```").map((part, index) => {
                        if (index % 2 === 0) {
                          return (
                            <React.Fragment key={index}>{part}</React.Fragment>
                          );
                        } else {
                          return (
                            <pre className="whitespace-pre-wrap" key={index}>
                              <CodeDisplayBlock code={part} lang="" />
                            </pre>
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
                )}
              </div>
            </div>
          ))}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}
