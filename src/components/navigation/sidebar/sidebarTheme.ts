import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * The horizontal space the sidebar occupies in the shell.
 *
 * Exported because the admin dashboard measures its own charts against the
 * shell, and a width that lived only in a class name would leave that maths
 * silently wrong the next time this changes.
 */
export const SIDEBAR_WIDTH = 288;

/** Geometry, kept together so the header, pills and seal stay in proportion. */
export const SIDEBAR_METRICS = {
  /** Sidebar's own horizontal padding. */
  paddingX: 20,
  /**
   * Nav row. Roomy rather than tall — the label carries the row, so the pill
   * only has to be comfortable to hit, not to fill the column.
   */
  itemHeight: 48,
  itemRadius: 24,
  itemPaddingX: 16,
  itemGap: 10,
  /**
   * Deliberately smaller than the label's 16px. The icon is a landmark for a
   * destination the reader already knows by name; sized level with the text it
   * competes with the word instead of pointing at it.
   */
  iconSize: 19,
  iconGap: 15,
  /** The official barangay seal, framed by the footer's decorations. */
  sealSize: 88,
} as const;

/**
 * Sidebar colours.
 *
 * Stated as values rather than utility classes because the same tones drive the
 * footer's SVG artwork, where Tailwind classes do not reach. The dark set exists
 * only so the app-wide theme toggle keeps working — the design is specified
 * light, and dark is a faithful translation of it rather than its own look.
 */
export function useSidebarPalette() {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === "dark";

    return {
      isDark,
      surface: isDark ? "#0F172A" : "#FFFFFF",
      /** The hairline separating the sidebar from the content beside it. */
      border: isDark ? "#1E293B" : "#E4EAF2",
      /** "DOCTOR". */
      eyebrow: isDark ? "#7C8DA6" : "#7387A8",
      /** "Workspace". */
      heading: isDark ? "#F8FAFC" : "#0F2756",
      /** Resting nav label and icon. */
      idle: isDark ? "#94A3B8" : "#50658A",
      /** Selected nav label and icon. */
      active: isDark ? "#93C5FD" : "#1683F8",
      activeBg: isDark ? "rgba(37,99,235,0.16)" : "#EAF4FF",
      hoverBg: isDark ? "rgba(148,163,184,0.10)" : "#F5F9FF",
      /** Footer artwork — orbit, leaves, sparkles, waves. Never text. */
      decorLine: isDark ? "#2B4A6F" : "#A8D3FF",
      decorSoft: isDark ? "#1E3A5F" : "#CBE5FF",
      wave: isDark ? "#16304D" : "#DCEBFB",
      waveSoft: isDark ? "#111F35" : "#EFF6FE",
      /** "SERVING THE COMMUNITY" and the heart rule beneath it. */
      community: isDark ? "#7C8DA6" : "#5B7196",
    };
  }, [resolvedTheme]);
}

export type SidebarPalette = ReturnType<typeof useSidebarPalette>;
