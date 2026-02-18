import ChatThread from "./page-client";
import { getChatWithMessages } from "@/server/actions/chat-actions";

type PageProps = {
  params: Promise<{ chatId: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function ChatMessagePage({
  params,
  searchParams,
}: PageProps) {
  const { chatId } = await params;
  const { q } = await searchParams;

  const chat = await getChatWithMessages(chatId);

  if (!chat) {
    return <div>Chat not found</div>;
  }

  return (
    <ChatThread
      chatId={chatId}
      initialMessages={chat.messages}
      initialPrompt={q}
    />
  );
}
