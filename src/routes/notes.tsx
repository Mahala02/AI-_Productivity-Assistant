import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workplace AI" },
      {
        name: "description",
        content:
          "Turn messy meeting notes or transcripts into structured summaries, decisions and owned action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Workplace AI" },
      {
        property: "og:description",
        content: "Summaries, decisions and action items extracted from raw meeting notes.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <ToolWorkspace
      tool="notes"
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript and get a clean summary with decisions, action items and open questions."
      outputLabel="Meeting summary"
      cta="Summarize notes"
      fields={[
        { name: "meeting", label: "Meeting title", placeholder: "Q3 roadmap review" },
        { name: "attendees", label: "Attendees", placeholder: "Yolanda, Sipho, Anna (product)" },
        { name: "notes", label: "Raw notes or transcript", type: "textarea", rows: 12, placeholder: "Paste your notes here…", required: true },
        { name: "focus", label: "Summary focus", type: "select", options: ["Balanced", "Action items first", "Decisions & rationale", "Executive one-pager"] },
      ]}
      buildPrompt={(v) =>
        `Summarize the following meeting.\nMeeting: ${v.meeting || "Untitled"}\nAttendees: ${v.attendees || "Not provided"}\nSummary focus: ${v.focus}\n\nRaw notes:\n"""\n${v.notes}\n"""`
      }
    />
  );
}
