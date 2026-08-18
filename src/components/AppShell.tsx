import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DISCLAIMER } from "@/lib/prompts";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chatbot", icon: Bot },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground",
          }}
        >
          <Icon className="size-4 shrink-0 opacity-80" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-2 py-1">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient">
          <Sparkles className="size-4 text-primary-foreground" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-sidebar-foreground">
            Workplace AI
          </span>
          <span className="block text-xs text-sidebar-foreground/60">
            Productivity Assistant
          </span>
        </span>
      </Link>
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 p-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground">
          <ShieldCheck className="size-3.5" /> Responsible AI
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-sidebar-foreground/60">
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden border-r border-sidebar-border/50 lg:block lg:h-screen lg:sticky lg:top-0">
        <SidebarBody />
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-border p-2 text-foreground"
          >
            <Menu className="size-4" />
          </button>
          <span className="font-display text-sm font-semibold">Workplace AI</span>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-foreground/50"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 shadow-card">
              <button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-lg p-2 text-sidebar-foreground/70"
              >
                <X className="size-4" />
              </button>
              <SidebarBody onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className={cn("flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10")}>{children}</main>
      </div>
    </div>
  );
}
