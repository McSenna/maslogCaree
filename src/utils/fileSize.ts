const KB = 1024;
const MB = 1024 * KB;

/** Human-readable file size ("512 B", "84 KB", "2.4 MB"); empty for missing or zero sizes. */
export const formatFileSize = (raw?: number | string | null): string => {
  const bytes = Number(raw) || 0;
  if (bytes <= 0) return "";
  if (bytes < KB) return `${bytes} B`;
  if (bytes < MB) return `${Math.round(bytes / KB)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
};
