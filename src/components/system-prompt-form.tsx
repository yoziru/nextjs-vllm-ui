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
  name: z.string(),
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
    toast.success("System prompt updated.");
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

  const clearSystemPrompt = () => {
    setName("");
    form.setValue("name", "");
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
                  className="w-full p-2 border-2 border-sky-500 rounded-sm h-full my-4"
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
        <DialogClose className="w-full flex gap-4">
          <Button
            onClick={clearSystemPrompt}
            variant="ghost"
            className="w-full"
            size="sm"
          >
            Clear
          </Button>
          <Button type="submit" variant="default" className="w-full" size="sm">
            Save
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
