import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Copy, Eye, Loader2, Pencil, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { generateOutput } from "@/lib/ai.functions";
import { DISCLAIMER, type ToolId } from "@/lib/prompts";
import { MarkdownView } from "@/components/MarkdownView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  rows?: number;
};

type Props = {
  tool: ToolId;
  title: string;
  description: string;
  fields: Field[];
  buildPrompt: (values: Record<string, string>) => string;
  cta?: string;
  outputLabel?: string;
};

export function ToolWorkspace({
  tool,
  title,
  description,
  fields,
  buildPrompt,
  cta = "Generate with AI",
  outputLabel = "AI output",
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [f.name, f.type === "select" ? (f.options?.[0] ?? "") : ""]),
    ),
  );
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const generate = useServerFn(generateOutput);

  const mutation = useMutation({
    mutationFn: async () => {
      const missing = fields.filter((f) => f.required && !values[f.name]?.trim());
      if (missing.length) {
        throw new Error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      }
      return generate({ data: { tool, prompt: buildPrompt(values) } });
    },
    onSuccess: (data) => {
      setOutput(data.text);
      setEditing(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Structured prompt
          </h2>
          <div className="mt-4 space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    rows={field.rows ?? 6}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.name]: e.target.value }))
                    }
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={values[field.name] ?? ""}
                    onValueChange={(val) =>
                      setValues((v) => ({ ...v, [field.name]: val }))
                    }
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.name]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}
            <Button
              className="w-full"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> {cta}
                </>
              )}
            </Button>
          </div>
        </section>

        <section className="flex min-h-[24rem] flex-col rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {outputLabel}
            </h2>
            {output && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
                  {editing ? (
                    <>
                      <Eye className="size-3.5" /> Preview
                    </>
                  ) : (
                    <>
                      <Pencil className="size-3.5" /> Edit
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy className="size-3.5" /> Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isPending}
                >
                  <RotateCcw className="size-3.5" /> Regenerate
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 flex-1">
            {mutation.isPending && !output ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" /> Working on your draft…
              </div>
            ) : output ? (
              editing ? (
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="min-h-[22rem] font-mono text-xs"
                />
              ) : (
                <MarkdownView content={output} />
              )
            ) : (
              <p className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                Fill in the prompt fields and generate. Every output stays fully editable.
              </p>
            )}
          </div>

          <p className="mt-5 flex gap-2 rounded-lg border border-border bg-secondary/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <TriangleAlert className="mt-px size-3.5 shrink-0" />
            {DISCLAIMER}
          </p>
        </section>
      </div>
    </div>
  );
}
