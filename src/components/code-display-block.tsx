"use client";
import React from "react";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { Button } from "./ui/button";

interface ButtonCodeblockProps {
  code: string;
  lang: string;
}

export default function CodeDisplayBlock({ code, lang }: ButtonCodeblockProps) {
  const [isCopied, setisCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setisCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => {
      setisCopied(false);
    }, 1500);
  };

  return (
    <div className="relative my-4 overflow-scroll overflow-x-scroll flex flex-col text-start">
      <pre className="rounded-md bg-slate-50 p-4 text-sm text-slate-950 dark:bg-[#303033] dark:text-slate-50">
        <code data-language={lang || undefined}>{code}</code>
      </pre>
      <Button
        onClick={copyToClipboard}
        variant="ghost"
        size="iconSm"
        className="h-5 w-5 absolute top-2 right-2"
      >
        {isCopied ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <CopyIcon className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
