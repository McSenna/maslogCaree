import { useDialogPresentation } from "@/hooks/useDialogPresentation";

import { DialogModalShell, DialogSheetShell, type DialogShellProps } from "./DialogShells";

/**
 * One overlay for both platforms: a centred modal once there is desktop room,
 * a bottom sheet at phone width. Both shells already own keyboard insets, safe
 * areas, focus trapping, Escape and scroll locking.
 */
const ResponsiveDialog = (props: DialogShellProps) =>
  useDialogPresentation() === "modal" ? (
    <DialogModalShell {...props} />
  ) : (
    <DialogSheetShell {...props} />
  );

export default ResponsiveDialog;
