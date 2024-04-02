"use client";

import * as React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { useHasMounted } from "@/lib/utils";
import { DialogHeader } from "./ui/dialog";

export default function ClearChatsButton() {
  const hasMounted = useHasMounted();
  const router = useRouter();

  if (!hasMounted) {
    return null;
  }

  const chats = Object.keys(localStorage).filter((key) =>
    key.startsWith("chat_")
  );

  const disabled = chats.length === 0;

  const clearChats = () => {
    chats.forEach((key) => {
      localStorage.removeItem(key);
    });
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  return (
    <Dialog>
      <DialogTrigger
        className="inline-flex items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 rounded-sm px-3 text-xs justify-start gap-2 w-full"
        disabled={disabled}
      >
        <TrashIcon className="w-4 h-4" />
        <span>Clear chats</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-2">
          <DialogDescription className="text-xs">
            Are you sure you want to delete all chats? This action cannot be
            undone.
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <DialogClose className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-sm text-xs">
              Cancel
            </DialogClose>
            <DialogClose
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-3 py-2 rounded-sm text-xs"
              onClick={() => clearChats()}
            >
              Delete
            </DialogClose>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
