import type { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";

export type DialogShellProps = {
  visible: boolean;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  /** Replaces the icon badge, e.g. the barangay seal. Decorative: hidden from screen readers. */
  media?: ReactNode;
  tint?: string;
  tintSoft?: string;
  onClose: () => void;
  children: ReactNode;
  /** Pinned below the scroll region in both presentations. */
  footer?: ReactNode;
  maxWidth?: number;
  /** Return true to consume Escape or the Android back press without closing. */
  onDismissRequest?: () => boolean;
};
