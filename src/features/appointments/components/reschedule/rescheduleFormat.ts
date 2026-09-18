export const formatSlotTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export const formatScheduleDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatSlotWhen = (iso: string): string =>
  `${formatScheduleDate(iso)} – ${formatSlotTime(iso)}`;
