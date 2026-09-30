/** Browsers save the CSV as a file download. */
export const exportAnnouncementsCsv = async (csv: string, fileName: string): Promise<void> => {
  // The byte-order mark makes Excel read the file as UTF-8, so names with ñ survive.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
