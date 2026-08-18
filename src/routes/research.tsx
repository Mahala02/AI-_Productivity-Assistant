import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Get structured briefings on any work topic, with trade-offs, next steps and claims flagged for verification.",
      },
      { property: "og:title", content: "AI Research Assistant | Workplace AI" },
      {
        property: "og:description",
        content: "Structured research briefings with explicit uncertainty and next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <ToolWorkspace
      tool="research"
      title="AI Research Assistant"
      description="Brief yourself before a decision or meeting. Outputs flag what still needs a primary source."
      outputLabel="Research briefing"
      cta="Run research brief"
      fields={[
        { name: "topic", label: "Research question or topic", type: "textarea", rows: 5, placeholder: "How should a 40-person services firm approach AI usage policies?", required: true },
        { name: "audience", label: "Who is this for?", placeholder: "Exec team, non-technical" },
        { name: "depth", label: "Depth", type: "select", options: ["Quick brief", "Standard briefing", "Deep dive"] },
        { name: "angle", label: "Specific angles to cover", type: "textarea", rows: 4, placeholder: "Cost, compliance, change management, vendor options" },
      ]}
      buildPrompt={(v) =>
        `Research topic: ${v["topic"]}\nAudience: ${v["audience"] || "General business audience"}\nDepth: ${v["depth"]}\nAngles to cover: ${v["angle"] || "Choose the most decision-relevant angles"}`
      }
    />
  );
}
