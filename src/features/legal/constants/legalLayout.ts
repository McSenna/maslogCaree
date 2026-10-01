import { DIALOG_CONTENT_PADDING } from "@/components/ui/dialog/dialogModalStyle";

/**
 * Width of the running text: at the 16px body size this keeps lines near 70
 * characters, inside the 65 to 75 range that long reading needs.
 */
export const LEGAL_MEASURE = 600;

/** The dialog wraps the same measure in its own side padding. */
export const LEGAL_DIALOG_MAX_WIDTH = LEGAL_MEASURE + 2 * DIALOG_CONTENT_PADDING;
