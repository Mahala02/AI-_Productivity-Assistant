import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Bot, Loader2, Send, TriangleAlert, User } from "lucide-react";
import { toast } from "sonner";
import { MarkdownView } from "@/components/MarkdownView";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DISCLAIMER } from "@/lib/prompts";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant for drafting, planning and analysis, with full conversation context.",
      },
      { property: "og:title", content: "AI Chatbot Assistant | Workplace AI" },
      {
        property: "og:description",
        content: "A conversational AI co-worker for everyday workplace tasks.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me push back politely on an unrealistic deadline",
  "Turn these bullet points into a status update",
  "What should I ask in a vendor demo call?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;
    const history: Msg[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        throw new Error((await res.text()) || "The assistant is unavailable right now.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: acc }]);
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    } catch (error) {
      setMessages(history);
      toast.error((error as Error).message);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col gap-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold sm:text-3xl">AI Chatbot Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Your conversational co-worker. Full conversation context is sent with every message.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card shadow-card">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-gradient">
                <Bot className="size-5 text-primary-foreground" />
              </span>
              <p className="text-sm text-muted-foreground">Start with a prompt:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className={
                    m.role === "user"
                      ? "flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
                      : "flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground"
                  }
                >
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </span>
                <div className="min-w-0 flex-1 rounded-xl bg-secondary/50 px-4 py-3">
                  {m.content ? (
                    <MarkdownView content={m.content} />
                  ) : (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              rows={2}
              value={input}
              placeholder="Ask anything about your work…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              className="min-h-[3rem] resize-none"
            />
            <Button onClick={() => send(input)} disabled={streaming || !input.trim()} size="lg">
              {streaming ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          <p className="mt-3 flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <TriangleAlert className="mt-px size-3.5 shrink-0" />
            {DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
