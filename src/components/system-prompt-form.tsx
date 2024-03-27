"use client";

import React, { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import TextareaAutosize from "react-textarea-autosize";
import { SystemPromptProps } from "./system-prompt";
import { DialogClose } from "@radix-ui/react-dialog";
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please set a system prompt",
  }),
});

export default function SystemPromptForm({
  chatOptions,
  setChatOptions,
}: SystemPromptProps) {
  const systemPrompt = chatOptions ? chatOptions.systemPrompt : "";
  const [name, setName] = useState(systemPrompt);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // set system prompt to local storage
    setChatOptions({ ...chatOptions, systemPrompt: data.name });
    toast.success("System prompt saved");
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    form.setValue("name", e.currentTarget.value);
    setName(e.currentTarget.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(form.getValues());
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full items-center relative gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col">
              <FormLabel>System Prompt</FormLabel>
              <div>
                <TextareaAutosize
                  {...field}
                  className="w-full p-2 border rounded-xs"
                  autoComplete="off"
                  rows={3}
                  value={name}
                  onKeyDown={handleKeyPress}
                  onChange={(e) => handleChange(e)}
                  name="message"
                  placeholder="You are a helpful assistant."
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose className="space-y-2 w-full">
          <Button type="submit" className="w-full">
            Save system prompt
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
