import { useState, type ReactNode, type RefObject } from "react";
import { Platform, ScrollView, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

import { DIALOG_CONTENT_PADDING } from "../dialogModalStyle";

/** Room for a 288-wide panel inside the aside's own padding. */
export const DIALOG_ASIDE_WIDTH = 328;

// The gap the panes kept when they shared one scroll region, now each pane's inner edge.
const PANE_GAP = 20;
const BOTTOM_PADDING = 24;

type Props = {
  scrollRef: RefObject<ScrollView | null>;
  palette: ResidentDialogPalette;
  aside: ReactNode;
  asideLabel: string;
  asideWidth: number;
  children: ReactNode;
};

/**
 * The dialog body as two panes: the main content scrolls on its own and the
 * aside stays where it is. Both are bounded by the dialog's height (the row
 * shrinks between header and footer), so neither pushes the other.
 *
 * The aside only scrolls when it is taller than the dialog, on a short screen.
 * It holds no controls, so then it takes focus itself, or a keyboard user
 * could never scroll it; when it fits it adds no tab stop.
 */
export const DialogSplitBody = ({ scrollRef, palette, aside, asideLabel, asideWidth, children }: Props) => {
  const [asideHeight, setAsideHeight] = useState(0);
  const [asideContentHeight, setAsideContentHeight] = useState(0);
  const asideScrolls = asideContentHeight > asideHeight + 1;

  return (
    <View className="min-h-0 shrink flex-row">
      <ScrollView
        ref={scrollRef}
        // The form takes whatever the aside leaves.
        style={{ flex: 1, minWidth: 0 }}
        contentContainerStyle={{ padding: DIALOG_CONTENT_PADDING, paddingRight: PANE_GAP, paddingBottom: BOTTOM_PADDING }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      <View className="w-px" style={{ backgroundColor: palette.divider }} />

      <ScrollView
        // A ScrollView grows by default on web; the aside keeps its width instead.
        style={{ width: asideWidth, flexGrow: 0, flexShrink: 0 }}
        // Grows to the pane's height, so a full-height panel fills its column.
        contentContainerStyle={{ flexGrow: 1, padding: DIALOG_CONTENT_PADDING, paddingLeft: PANE_GAP, paddingBottom: BOTTOM_PADDING }}
        onLayout={(event) => setAsideHeight(event.nativeEvent.layout.height)}
        onContentSizeChange={(_, height) => setAsideContentHeight(height)}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel={asideLabel}
        focusable={asideScrolls}
        {...Platform.select({ web: { role: "region", tabIndex: asideScrolls ? 0 : undefined } as object })}
      >
        {aside}
      </ScrollView>
    </View>
  );
};

type BodyProps = Omit<Props, "asideLabel" | "asideWidth" | "aside"> & {
  flush: boolean;
  aside?: ReactNode;
  asideLabel: string;
  asideWidth: number;
};

/** The centred dialog's body: one scroll region, or two panes when there is an aside. */
export const DialogBody = ({ flush, aside, scrollRef, children, ...split }: BodyProps) => {
  if (aside) {
    return (
      <DialogSplitBody {...split} scrollRef={scrollRef} aside={aside}>
        {children}
      </DialogSplitBody>
    );
  }
  return (
    <ScrollView
      ref={scrollRef}
      // Unchanged from before the aside existed: every other dialog uses this path.
      style={{ flexShrink: 1 }}
      contentContainerStyle={flush ? undefined : { padding: DIALOG_CONTENT_PADDING, paddingBottom: BOTTOM_PADDING }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
};

export default DialogSplitBody;
