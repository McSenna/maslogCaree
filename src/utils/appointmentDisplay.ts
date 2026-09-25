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
