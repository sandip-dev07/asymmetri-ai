"use client";

import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import ChatMessage from "@/components/dashboard/chat-message";
import { Textarea } from "@/components/ui/textarea";

interface ChatThreadProps {
  chatId: string;
  initialMessages: UIMessage[];
  initialPrompt?: string;
}

export default function ChatThread({
  chatId,
  initialMessages,
  initialPrompt,
}: ChatThreadProps) {
  const [input, setInput] = useState("");
  const didSendInitialPrompt = useRef(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage, status } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `/api/chat/${chatId}`,
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const sendCurrentMessage = () => {
    const text = input.trim();
    if (!text || status !== "ready") return;

    setInput("");
    void sendMessage({ text });
  };

  useEffect(() => {
    if (didSendInitialPrompt.current) return;
    if (!initialPrompt?.trim()) return;
    if (messages.length > 0) return;

    didSendInitialPrompt.current = true;
    void sendMessage({ text: initialPrompt.trim() });
  }, [initialPrompt, messages.length, sendMessage]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  return (
    <section className="w-full h-[87vh] flex flex-col gap-3">
      <div className="flex-1 h-full max-w-3xl mx-auto overflow-y-auto w-full space-y-4 rounded-xl p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="min-w-8" />
            <div className="pt-1">
              <span className="shiny-loader-text text-sm text-muted-foreground">
                Analysing...
              </span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <form
        className="max-w-3xl w-full mx-auto relative bottom-0"
        onSubmit={(event) => {
          event.preventDefault();
          sendCurrentMessage();
        }}
      >
        <div className="group w-full relative max-h-40">
          <Textarea
            className="rounded-2xl max-h-40 w-full"
            placeholder="Ask me anything!"
            cols={3}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendCurrentMessage();
              }
            }}
          />
          <button
            type="submit"
            disabled={status !== "ready" || input.trim().length === 0}
            className="absolute bottom-1 right-1 cursor-pointer disabled:opacity-60"
          >
            <ArrowRight
              size={28}
              className="bg-black rounded-full p-1.5 text-white"
            />
          </button>
        </div>
      </form>
    </section>
  );
}
