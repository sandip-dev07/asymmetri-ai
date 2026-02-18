"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createChatSession } from "@/server/actions/chat-actions";

const examplePrompts = ["Weather in Delhi", "Next F1 race", "AAPL stock price"];

export default function NewChat() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isPending, startTransition] = useTransition();

  const startChat = (value: string) => {
    const cleanPrompt = value.trim();
    if (!cleanPrompt) return;

    startTransition(async () => {
      const chatId = await createChatSession(cleanPrompt);
      router.push(`/chat/${chatId}?q=${cleanPrompt}`);
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startChat(prompt);
  };

  return (
    <section className="w-full h-[90vh] flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
          How can I help you?
        </h2>

        <form className="group w-full relative max-h-40" onSubmit={onSubmit}>
          <Textarea
            className="rounded-2xl max-h-40 w-full"
            placeholder="Ask me anything!"
            cols={3}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
              }
            }}
          />
          <button
            type="submit"
            disabled={isPending || !prompt.trim()}
            className="absolute bottom-1 right-1 cursor-pointer disabled:opacity-60"
          >
            <ArrowRight
              size={28}
              className="bg-black rounded-full p-1.5 text-white"
            />
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {examplePrompts.map((q) => (
            <Button
              key={q}
              onClick={() => startChat(q)}
              variant="outline"
              size="sm"
              className="shadow-none rounded-full"
              disabled={isPending}
            >
              {q}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
