export const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return "";
  return bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
};
