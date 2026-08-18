import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Mail,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DISCLAIMER } from "@/lib/prompts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarize meetings, plan work, research topics and chat with an AI assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One workspace for AI email drafting, meeting summaries, task planning, research and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a few bullet points into a polished email with the right tone and length.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Convert messy notes or transcripts into decisions, action items and owners.",
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    title: "AI Task Planner",
    body: "Prioritise your workload into a realistic, time-blocked plan.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Brief yourself fast, with trade-offs and claims flagged for verification.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chatbot",
    body: "Think out loud with a conversational assistant that keeps full context.",
  },
] as const;

const STATS = [
  { label: "Assistants", value: "5" },
  { label: "Structured prompts", value: "20+" },
  { label: "Outputs", value: "Always editable" },
  { label: "Human review", value: "Required" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <section className="overflow-hidden rounded-3xl bg-brand-gradient p-8 text-primary-foreground sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
          <Sparkles className="size-3.5" /> AI workspace
        </span>
        <h1 className="mt-5 max-w-2xl text-3xl font-semibold sm:text-4xl">
          Automate the busywork of your workday
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
          Draft emails, summarize meetings, plan your week and research decisions — with
          structured prompts and outputs you stay in control of.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-4 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
          >
            Draft an email <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/40 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
          >
            Open the chatbot
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <p className="text-lg font-semibold sm:text-xl">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Your assistants</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-colors hover:border-ring"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-4.5" />
              </span>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-primary">
                Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="size-4 text-primary" /> Responsible AI use
        </h2>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {DISCLAIMER} This assistant supports your judgement — it does not replace it. Keep a
          human in the loop for decisions affecting people, money, or compliance.
        </p>
      </section>
    </div>
  );
}
