import type { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";

import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";

export type SupportOverlaySize = "form" | "content" | "wide";

const MAX_WIDTHS: Record<SupportOverlaySize, number> = {
  form: 680,
  content: 720,
  wide: 960,
};

type ResponsiveSupportOverlayProps = {
  open: boolean;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  size?: SupportOverlaySize;
  onClose: () => void;
  onDismissRequest?: () => boolean;
  footer?: ReactNode;
  children: ReactNode;
};

const ResponsiveSupportOverlay = ({
  open,
  title,
  icon,
  size = "content",
  onClose,
  onDismissRequest,
  footer,
  children,
}: ResponsiveSupportOverlayProps) => {
  if (!open) return null;

  return (
    <ResponsiveDialog
      visible
      title={title}
      icon={icon}
      maxWidth={MAX_WIDTHS[size]}
      onClose={onClose}
      onDismissRequest={onDismissRequest}
      footer={footer}
    >
      {children}
    </ResponsiveDialog>
  );
};

export default ResponsiveSupportOverlay;
