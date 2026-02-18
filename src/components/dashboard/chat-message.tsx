"use client";

import type { UIMessage } from "ai";
import { isTextUIPart } from "ai";
import { Bot, User } from "lucide-react";

import { useSession } from "next-auth/react";

import WeatherCard from "./tool-cards/weather-card";
import F1Card from "./tool-cards/f1-card";
import StockCard from "./tool-cards/stock-card";

type ChatMessageProps = {
  message: UIMessage;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { data: session } = useSession();
  const isUser = message.role === "user";

  let textContent = "";
  const toolParts = [];
  let hasToolError = false;

  for (const part of message.parts) {
    if (isTextUIPart(part)) {
      textContent += part.text;
    }

    if (typeof part.type === "string" && part.type.startsWith("tool-")) {
      toolParts.push(part);

      if ((part as { state?: string }).state === "output-error") {
        hasToolError = true;
      }
    }

    if (part.type === "dynamic-tool") {
      if ((part as { state?: string }).state === "output-error") {
        hasToolError = true;
      }
    }
  }

  const displayText =
    !isUser && hasToolError ? "Something went wrong, try again!" : textContent;

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-0 min-w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}

      <div
        className={`md:max-w-130 space-y-3 ${isUser ? "items-end" : "items-start"}`}
      >
        {displayText ? (
          <div
            className={`${
              isUser
                ? "rounded-l-2xl rounded-tr-none"
                : "rounded-r-2xl rounded-tl-none"
            } rounded-xl bg-zinc-200 px-4 py-1.5 text-sm leading-relaxed`}
          >
            <p className="whitespace-pre-wrap">{displayText}</p>
          </div>
        ) : null}

        {toolParts.length > 0 && (
          <div className="mt-2 space-y-2">
            {toolParts.map((part, index) => {
              if ((part as { state?: string }).state !== "output-available") {
                return null;
              }

              if (part.type === "tool-getWeather") {
                return (
                  <WeatherCard
                    key={`${message.id}-${index}`}
                    data={(part as { output: unknown }).output}
                  />
                );
              }

              if (part.type === "tool-getF1Matches") {
                return (
                  <F1Card
                    key={`${message.id}-${index}`}
                    data={(part as { output: unknown }).output}
                  />
                );
              }

              if (part.type === "tool-getStockPrice") {
                return (
                  <StockCard
                    key={`${message.id}-${index}`}
                    data={(part as { output: unknown }).output}
                  />
                );
              }

              return null;
            })}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-0 min-w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
          {session?.user?.image ? (
            <img src={session?.user?.image} alt="" className="w-8 h-8" />
          ) : (
            <User className="w-4 h-4 text-primary" />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
