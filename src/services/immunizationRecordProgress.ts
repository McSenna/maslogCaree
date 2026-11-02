export type ImmunizationProgramProgress = {
  workflowStatus?: "draft" | "completed";
  recordStatus?: "in_progress" | "completed";
  immunizationProgress?: { administered: number; total: number };
};

export const immunizationProgressLabel = (
  record: ImmunizationProgramProgress,
): string | null => {
  if (!record.recordStatus) return null;
  const status =
    record.recordStatus === "in_progress" ? "In progress" : "Completed";
  const counts = record.immunizationProgress;
  const workflow = record.workflowStatus ? `${record.workflowStatus === "draft" ? "Draft entries" : "Completed entries"} · ` : "";
  return counts
    ? `${workflow}${status} · ${counts.administered} of ${counts.total} doses administered`
    : `${workflow}${status}`;
};
