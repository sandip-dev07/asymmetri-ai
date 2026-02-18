"use server";

import type { UIMessage } from "ai";
import { and, asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { authUserId } from "@/lib/auth";
import { chatSessions, messages } from "@/db/schema";

export interface ChatSessionSummary {
  id: string;
  title: string;
  createdAt: Date;
}

interface StoredMessage {
  id: string;
  role: string;
  content: string;
  toolName: string | null;
  toolData: unknown;
}

// helper: get title from prompt
function titleFromPrompt(prompt?: string): string {
  const text = prompt?.trim() || "";
  return text ? text.slice(0, 60) : "New Chat";
}

// helper: map db message to ui message
function mapDbMessageToUIMessage(message: StoredMessage): UIMessage | null {
  if (message.role !== "user" && message.role !== "assistant") {
    return null;
  }

  const parts: UIMessage["parts"] = [];

  if (message.content.trim()) {
    parts.push({
      type: "text",
      text: message.content,
      state: "done",
    });
  }

  if (message.role === "assistant" && message.toolName && message.toolData) {
    const toolName = message.toolName;
    let input: Record<string, unknown> = {};

    if (toolName === "getWeather") {
      const weatherData = message.toolData as { location?: string };
      input = { location: weatherData.location ?? "" };
    } else if (toolName === "getStockPrice") {
      const stockData = message.toolData as { symbol?: string };
      input = { symbol: stockData.symbol ?? "" };
    }

    parts.push({
      type: `tool-${toolName}`,
      toolCallId: `persisted-${message.id}`,
      state: "output-available",
      input,
      output: message.toolData,
    } as UIMessage["parts"][number]);
  }

  return {
    id: message.id,
    role: message.role as "user" | "assistant",
    parts,
  };
}
// create chat
export async function createChatSession(
  initialPrompt?: string,
): Promise<string> {
  const userId = await authUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [chat] = await db
    .insert(chatSessions)
    .values({
      userId,
      title: titleFromPrompt(initialPrompt),
    })
    .returning({ id: chatSessions.id });

  revalidatePath("/");
  return chat.id;
}

// get chat
export async function getUserChatSessions(): Promise<ChatSessionSummary[]> {
  const userId = await authUserId();

  if (!userId) {
    return [];
  }

  const rows = await db
    .select({
      id: chatSessions.id,
      title: chatSessions.title,
      createdAt: chatSessions.createdAt,
    })
    .from(chatSessions)
    .where(eq(chatSessions.userId, userId))
    .orderBy(desc(chatSessions.createdAt));

  return rows.map((row) => ({
      id: row.id,
      title: row.title || "New Chat",
      createdAt: row.createdAt,
    }));
}

// get chat with messages
export async function getChatWithMessages(chatId: string): Promise<{
  chat: ChatSessionSummary;
  messages: UIMessage[];
} | null> {
  const userId = await authUserId();

  if (!userId) {
    return null;
  }

  const [chat] = await db
    .select({
      id: chatSessions.id,
      title: chatSessions.title,
      createdAt: chatSessions.createdAt,
    })
    .from(chatSessions)
    .where(and(eq(chatSessions.id, chatId), eq(chatSessions.userId, userId)))
    .limit(1);

  if (!chat) {
    return null;
  }

  const chatMessages = await db
    .select({
      id: messages.id,
      role: messages.role,
      content: messages.content,
      toolName: messages.toolName,
      toolData: messages.toolData,
    })
    .from(messages)
    .where(eq(messages.chatSessionId, chatId))
    .orderBy(asc(messages.createdAt));

  const uiMessages = chatMessages.reduce<UIMessage[]>((acc, dbMessage) => {
    const message = mapDbMessageToUIMessage(dbMessage);
    if (message) {
      acc.push(message);
    }
    return acc;
  }, []);

  return {
    chat: {
      id: chat.id,
      title: chat.title || "New Chat",
      createdAt: chat.createdAt,
    },
    messages: uiMessages,
  };
}
