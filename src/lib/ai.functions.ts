import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const Input = z.object({
  tool: z.enum(["email", "notes", "planner", "research"]),
  prompt: z.string().min(1),
});

export const generateOutput = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const { createLovableAiGatewayProvider, requireGatewayKey, CHAT_MODEL } = await import(
      "./ai-gateway.server"
    );
    const { TOOL_SYSTEM_PROMPTS } = await import("./prompts");

    const gateway = createLovableAiGatewayProvider(requireGatewayKey());

    try {
      const result = streamText({
        model: gateway(CHAT_MODEL),
        system: TOOL_SYSTEM_PROMPTS[data.tool],
        prompt: data.prompt,
      });
      return { text: await result.text };
    } catch (error) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      if (status === 402) {
        throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
      }
      if (status === 429) {
        throw new Error("Too many requests right now. Please wait a moment and try again.");
      }
      throw new Error(
        (error as Error)?.message || "The AI request failed. Please try again.",
      );
    }
  });
