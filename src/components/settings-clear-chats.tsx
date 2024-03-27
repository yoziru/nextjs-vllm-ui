"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "./ui/dialog";
import { useRouter } from "next/navigation";

export default function ClearChatsButton() {
  const chats = Object.keys(localStorage).filter((key) =>
    key.startsWith("chat_")
  );

  const disabled = chats.length === 0;
  const router = useRouter();

  const clearChats = () => {
    chats.forEach((key) => {
      localStorage.removeItem(key);
    });
    window.dispatchEvent(new Event("storage"));
    router.push("/")
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full" disabled={disabled}>
        <Button
          className="justify-start gap-2 w-full hover:bg-destructive/30 hover:text-red-500"
          size="sm"
          variant="ghost"
          disabled={disabled}
        >
          <TrashIcon className="w-4 h-4" />
          <p>Clear chats</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-2">
          <DialogDescription className="text-xs">
            Are you sure you want to delete all chats? This action cannot be
            undone.
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              <DialogClose>Cancel</DialogClose>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => clearChats()}>
              <DialogClose>Delete</DialogClose>
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
