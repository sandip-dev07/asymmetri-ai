import { Bot, User } from "lucide-react";
import WeatherCard from "./tool-cards/weather-card";
import F1Card from "./tool-cards/f1-card";
import StockCard from "./tool-cards/stock-card";

interface ChatMessageProps {
  message: unknown;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mt-1">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div
        className={`max-w-130 space-y-3 ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed`}
        >
          <div
            className="whitespace-pre-wrap bg-zinc-200 p-1 px-2 rounded-md"
            dangerouslySetInnerHTML={{
              __html: message.content
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/• /g, "<br/>• "),
            }}
          />
        </div>
        {message.toolCall && (
          <div className="mt-2">
            {message.toolCall.type === "weather" && (
              <WeatherCard data={message.toolCall.data as unknown} />
            )}
            {message.toolCall.type === "f1" && (
              <F1Card data={message.toolCall.data as unknown} />
            )}
            {message.toolCall.type === "stock" && (
              <StockCard data={message.toolCall.data as unknown} />
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-0 min-w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mt-2">
          <User className="w-4 h-4 text-primary" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
