// Five fixed categories — must stay in lockstep with:
//   - boilerplate_app/core/categories.py
//   - supabase/migrations/0001_init.sql (pdf_category enum)

export const CATEGORIES = [
  { id: "civil-structural-foundation", label: "Civil, Structural and Foundation" },
  { id: "electrical-engineering", label: "Electrical Engineering" },
  { id: "instrumentation-control", label: "Instrumentation and Control" },
  { id: "piping-design-materials", label: "Piping Design and Materials" },
  { id: "quality-inspection-certification", label: "Quality, Inspection and Certification" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));

export function isCategory(value: unknown): value is CategoryId {
  return typeof value === "string" && CATEGORY_IDS.has(value);
}

export function labelFor(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
