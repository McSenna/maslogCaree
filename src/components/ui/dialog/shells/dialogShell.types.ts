import type { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";

export type DialogShellProps = {
  visible: boolean;
  title: string;
  icon: keyof typeof Feather.glyphMap;
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
