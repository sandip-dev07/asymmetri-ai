import ChatMessage from "@/components/dashboard/chat-message";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

export default function ChatMessagePage() {
  return (
    <section className="w-full h-[88vh] flex flex-col gap-1">
      <div className="flex-1 h-full max-w-3xl mx-auto  overflow-y-auto border w-full">
        <ChatMessage message={{ role: "user", content: "Hello" }} />
      </div>
      <div className="max-w-3xl w-full mx-auto relative bottom-0">
        <div className="group w-full relative max-h-40">
          <Textarea
            className="rounded-2xl max-h-40 w-full"
            placeholder="Ask me anything!"
            cols={3}
          />
          <button className="absolute bottom-1 right-1 cursor-pointer">
            <ArrowRight
              size={28}
              className="bg-black rounded-full p-1.5  text-white"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
