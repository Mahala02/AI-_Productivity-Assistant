import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";

const Body = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { createLovableAiGatewayProvider, requireGatewayKey, CHAT_MODEL } = await import(
          "@/lib/ai-gateway.server"
        );
        const { CHAT_SYSTEM_PROMPT } = await import("@/lib/prompts");

        const parsed = Body.safeParse(await request.json());
        if (!parsed.success) {
          return new Response("Invalid request", { status: 400 });
        }

        try {
          const gateway = createLovableAiGatewayProvider(requireGatewayKey());
          const result = streamText({
            model: gateway(CHAT_MODEL),
            system: CHAT_SYSTEM_PROMPT,
            messages: parsed.data.messages,
          });
          return result.toTextStreamResponse();
        } catch (error) {
          const status =
            (error as { statusCode?: number; status?: number })?.statusCode ?? 500;
          return new Response(
            (error as Error)?.message || "AI request failed",
            { status: status === 402 || status === 429 ? status : 500 },
          );
        }
      },
    },
  },
});
