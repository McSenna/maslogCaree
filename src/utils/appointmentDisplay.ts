export const statusLabel = (status?: string): string => {
  const normalized = (status ?? "").toLowerCase();

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    rescheduled: "Rescheduled",
    declined: "Declined",
    processing: "In Progress",
    completed: "Completed",
  };

  return statusLabels[normalized] ?? (normalized || "Unknown");
};

export const getAssignedStaffName = (assignedBy: unknown): string => {
  if (!assignedBy || typeof assignedBy !== "object") {
    return "";
  }

  const record = assignedBy as Record<string, unknown>;
  const field =
    typeof record.fullname === "string"
      ? record.fullname
      : typeof record.name === "string"
        ? record.name
        : "";

  return field.trim();
};
