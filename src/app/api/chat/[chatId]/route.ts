import { convertToModelMessages, streamText, tool, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { chatSessions, messages } from "@/db/schema";
import { authUserId } from "@/lib/auth";
import { getF1Matches, getStockPrice, getWeather } from "@/lib/tools";

function readTextFromMessage(message: UIMessage): string {
  let text = "";

  for (const part of message.parts) {
    if (part.type === "text") {
      text += `${part.text}\n`;
    }
  }

  return text.trim();
}

export async function POST(
  req: Request,
  context: { params: Promise<{ chatId: string }> },
) {
  const { chatId } = await context.params;
  const userId = await authUserId();

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const [chat] = await db
    .select({ id: chatSessions.id })
    .from(chatSessions)
    .where(and(eq(chatSessions.id, chatId), eq(chatSessions.userId, userId)))
    .limit(1);

  if (!chat) {
    return new Response("Chat not found", { status: 404 });
  }

  const body = (await req.json()) as { messages: UIMessage[] };
  const incomingMessages = body.messages ?? [];

  let latestUserText = "";
  for (let i = incomingMessages.length - 1; i >= 0; i -= 1) {
    const message = incomingMessages[i];
    if (message.role === "user") {
      latestUserText = readTextFromMessage(message);
      break;
    }
  }

  if (latestUserText) {
    const [latestStored] = await db
      .select({ role: messages.role, content: messages.content })
      .from(messages)
      .where(eq(messages.chatSessionId, chatId))
      .orderBy(desc(messages.createdAt))
      .limit(1);

    const isDuplicate =
      latestStored?.role === "user" && latestStored.content === latestUserText;

    if (!isDuplicate) {
      await db.insert(messages).values({
        chatSessionId: chatId,
        role: "user",
        content: latestUserText,
      });
    }
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(incomingMessages),
    tools: {
      getWeather: tool({
        description: "Get weather by city",
        inputSchema: z.object({
          location: z.string().describe("City name"),
        }),
        execute: async ({ location }) => getWeather(location),
      }),
      getStockPrice: tool({
        description: "Get stock price by symbol",
        inputSchema: z.object({
          symbol: z.string().describe("Stock ticker symbol"),
        }),
        execute: async ({ symbol }) => getStockPrice(symbol),
      }),
      getF1Matches: tool({
        description: "Get next F1 race",
        inputSchema: z.object({}),
        execute: async () => getF1Matches(),
      }),
    },
    onFinish: async ({ text, steps }) => {
      try {
        const latestToolResult = steps
          .flatMap((step) => step.staticToolResults)
          .at(-1);

        await db.insert(messages).values({
          chatSessionId: chatId,
          role: "assistant",
          content: text.trim(),
          toolName: latestToolResult?.toolName ?? null,
          toolData: latestToolResult?.output ?? null,
        });
      } catch (error) {
        console.error("Failed to persist assistant message", error);
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
