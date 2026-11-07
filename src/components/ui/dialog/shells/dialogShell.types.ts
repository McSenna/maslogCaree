import type { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";

export type DialogShellProps = {
  visible: boolean;
  title: string;
  /** A short line under the title. */
  subtitle?: string;
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
  /** Corner radius of the centred dialog; defaults to the modal token. */
  radius?: number;
  /** The content draws its own padding, for panels that reach the dialog's edges. */
  flush?: boolean;
  /** How much of the screen height the sheet may take; defaults to the sheet's own. */
  sheetHeightRatio?: number;
  /**
   * A side column beside the body on the centred dialog (e.g. clinic hours next
   * to a form). The body then scrolls on its own and the aside stays put. The
   * sheet has no room for a column, so there it follows the body instead.
   */
  aside?: ReactNode;
  /** Names the aside for screen readers, as a region. */
  asideLabel?: string;
  asideWidth?: number;
  /** Pinned between the header and the scroll region, e.g. tabs. */
  subheader?: ReactNode;
  /** Changing this moves the body to `scrollToY`. */
  scrollToKey?: number;
  scrollToY?: number;
  /** For a form with its own fixed light colors: the frame stays light in dark mode to match. */
  lightSurface?: boolean;
  /** "prominent" is the larger task header (icon tile, headline, no rule) for multi-step forms. */
  headerVariant?: "default" | "prominent";
  /** Return true to consume Escape or the Android back press without closing. */
  onDismissRequest?: () => boolean;
};
