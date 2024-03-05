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
import { Loader2Icon } from "lucide-react";
import { Input } from "./ui/input";
import TextareaAutosize from "react-textarea-autosize";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please select a model to pull",
  }),
});

export default function SystemPromptForm() {
  // get system prompt from local storage
  const systemPrompt = localStorage.getItem("systemPrompt") ?? "";

  const [name, setName] = useState(systemPrompt);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // set system prompt to local storage
    localStorage.setItem("systemPrompt", data.name);
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
        className="w-full items-center flex relative gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              {/* a multi-line input */}
              <TextareaAutosize
                {...field}
                autoComplete="off"
                value={name}
                onKeyDown={handleKeyPress}
                onChange={(e) => handleChange(e)}
                name="message"
                placeholder="You are a helpful assistant."
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2 w-full">
          <Button type="submit" className="w-full">
            Save system prompt
          </Button>
        </div>
      </form>
    </Form>
  );
}
