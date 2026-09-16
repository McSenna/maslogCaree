export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

export const isPdfDocument = (values: {
  idMimeType?: string;
  idDocument?: string;
  idFileName?: string;
}) =>
  Boolean(
    values.idMimeType?.includes("pdf") ||
      values.idDocument?.startsWith("data:application/pdf") ||
      values.idFileName?.toLowerCase().endsWith(".pdf")
  );

export const formatFileSize = (rawSize: string | number | undefined) => {
  const bytes = Number(rawSize) || 0;
  if (bytes <= 0) return "";
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
};
