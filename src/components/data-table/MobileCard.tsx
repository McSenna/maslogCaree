import { Pressable } from "react-native";

import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";

import AutoCard from "./AutoCard";
import { cardStyles } from "./cardStyles";
import { focusRing } from "./focusRing";
import type { DataTableProps } from "./types";

type MobileCardProps<T> = Pick<DataTableProps<T>, "columns" | "renderMobileCard" | "rowPressMode" | "rowHint"> & {
  row: T;
  index: number;
  plain: boolean;
  first: boolean;
  selected: boolean;
  label?: string;
  onPress?: () => void;
};

/** One record on a phone: a bordered card, or a divided block inside a panel. */
const MobileCard = <T,>({
  columns,
  renderMobileCard,
  rowPressMode = "button",
  rowHint,
  row,
  index,
  plain,
  first,
  selected,
  label,
  onPress,
}: MobileCardProps<T>) => {
  const colors = useThemeColors();
  const isButton = Boolean(onPress) && rowPressMode === "button";
  const { focused, pressed, handlers } = useInteractionState();
  const background = selected ? colors.rowSelected : pressed ? colors.rowHover : plain ? "transparent" : colors.surface;
  const frame = plain
    ? [cardStyles.plain, { borderTopWidth: first ? 0 : 1, borderTopColor: colors.rowDivider }]
    : [cardStyles.card, { borderColor: colors.border }];

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessible={isButton}
      focusable={isButton}
      tabIndex={isButton ? 0 : -1}
      role={isButton ? undefined : "listitem"}
      accessibilityRole={isButton ? "button" : undefined}
      accessibilityLabel={isButton ? label : undefined}
      accessibilityHint={isButton ? rowHint : undefined}
      accessibilityState={selected ? { selected } : undefined}
      style={[frame, { backgroundColor: background }, focused && isButton ? focusRing(colors.focusRing) : null]}
    >
      {renderMobileCard ? renderMobileCard(row) : <AutoCard columns={columns} row={row} index={index} />}
    </Pressable>
  );
};

export default MobileCard;
