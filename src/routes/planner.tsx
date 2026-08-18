import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI" },
      {
        name: "description",
        content:
          "Turn goals and to-do dumps into a prioritised, time-blocked work plan with dependencies and effort estimates.",
      },
      { property: "og:title", content: "AI Task Planner | Workplace AI" },
      {
        property: "og:description",
        content: "Prioritised, time-blocked plans generated from your goals and workload.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <ToolWorkspace
      tool="planner"
      title="AI Task Planner"
      description="Dump your goals and tasks, set your constraints, and get a prioritised plan you can edit and share."
      outputLabel="Work plan"
      cta="Build my plan"
      fields={[
        { name: "goals", label: "Goals & tasks", type: "textarea", rows: 8, placeholder: "Ship onboarding revamp, prep board deck, hire a designer, clear inbox backlog…", required: true },
        { name: "horizon", label: "Planning horizon", type: "select", options: ["Today", "This week", "Next two weeks", "This month", "This quarter"] },
        { name: "capacity", label: "Available focus time", placeholder: "e.g. 4 focus hours per day, meetings 9-11" },
        { name: "constraints", label: "Deadlines & constraints", type: "textarea", rows: 4, placeholder: "Board deck due Friday, designer interviews only on Tue…" },
        { name: "method", label: "Prioritisation style", type: "select", options: ["Impact vs effort", "Eisenhower matrix", "Deadline driven", "MoSCoW"] },
      ]}
      buildPrompt={(v) =>
        `Create a prioritised work plan.\nGoals and tasks:\n${v.goals}\nHorizon: ${v.horizon}\nAvailable capacity: ${v.capacity || "Not specified"}\nDeadlines and constraints: ${v.constraints || "None given"}\nPrioritisation method: ${v.method}`
      }
    />
  );
}
