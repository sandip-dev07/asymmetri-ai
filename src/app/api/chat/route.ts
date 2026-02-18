import { streamText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { getWeather, getStockPrice, getF1Matches } from "@/lib/tools";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google("gemini-2.5-flash"),
    messages,
    tools: {
      getWeather: tool({
        description: "Get weather by city",
        inputSchema: z.object({
          location: z.string().describe("City name"),
        }),
        execute: async ({ location }) => {
          return await getWeather(location);
        },
      }),
      getStockPrice: tool({
        description: "Get stock price by symbol",
        inputSchema: z.object({
          symbol: z.string().describe("Stock ticker symbol"),
        }),
        execute: async ({ symbol }) => {
          return await getStockPrice(symbol);
        },
      }),
      getF1Matches: tool({
        description: "Get next F1 race",
        inputSchema: z.object({}),
        execute: async () => {
          return await getF1Matches();
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
