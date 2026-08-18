import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with structured AI prompts and fully editable output.",
      },
      { property: "og:title", content: "Smart Email Generator | Workplace AI" },
      {
        property: "og:description",
        content: "Draft clear, professional business emails with AI and edit them inline.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <ToolWorkspace
      tool="email"
      title="Smart Email Generator"
      description="Describe the situation and let AI draft a polished email. Adjust tone, length and audience, then edit the draft before sending."
      outputLabel="Draft email"
      cta="Draft email"
      fields={[
        { name: "recipient", label: "Recipient / audience", placeholder: "e.g. Client CFO, my manager", required: true },
        { name: "purpose", label: "Purpose & key points", type: "textarea", rows: 6, placeholder: "Reschedule Thursday's review to next week, apologise for short notice, propose Tue or Wed 10:00.", required: true },
        { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Direct", "Apologetic", "Persuasive", "Formal"] },
        { name: "length", label: "Length", type: "select", options: ["Short (under 100 words)", "Medium", "Detailed"] },
        { name: "sender", label: "Sign-off name & role", placeholder: "Yolanda, Operations Lead" },
      ]}
      buildPrompt={(v) =>
        `Write a workplace email.\nRecipient/audience: ${v.recipient}\nPurpose and key points: ${v.purpose}\nTone: ${v.tone}\nLength: ${v.length}\nSign off as: ${v.sender || "[Your name]"}\nInclude a subject line first.`
      }
    />
  );
}
