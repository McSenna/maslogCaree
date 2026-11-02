import { Pressable, Text, View } from "react-native";
import { createShadow } from "@/design/shadow";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";
import { PALETTE } from "@/theme/palette";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  /** Shown after the label, e.g. how many rows the filter would leave. */
  count?: number;
};

type SegmentedControlProps<T extends string> = {
  palette: AdminDashboardPalette;
  /** Accessible name of the whole group, e.g. "Period". */
  label: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
  /** Stretch to the parent's width with equal segments (phones). */
  fill?: boolean;
  /** Comfortable page tabs use larger text and 44px segment targets. */
  size?: "sm" | "md";
  /** Segments that do not fit take the next line, so none is ever cut off. */
  wrap?: boolean;
};

const HEIGHT = 34;
const MIN_TARGET = 44;

const SELECTED_SHADOW = createShadow({ color: PALETTE.slate[800], opacity: 0.08, radius: 3, offsetY: 1, elevation: 1 });
const SEGMENT_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "color", "box-shadow") });

const Segment = <T extends string,>({
  palette,
  option,
  selected,
  onSelect,
  fill,
  size,
}: {
  palette: AdminDashboardPalette;
  option: SegmentOption<T>;
  selected: boolean;
  onSelect: (value: T) => void;
  fill: boolean;
  size: "sm" | "md";
}) => {
  const comfortable = size === "md";
  const { hovered, focused, handlers } = useInteractionState();
  const color = selected ? palette.heading : hovered ? palette.body : palette.muted;
  const countLabel = typeof option.count === "number" ? `, ${option.count}` : "";

  return (
    <Pressable
      {...handlers}
      onPress={() => onSelect(option.value)}
      role="radio"
      aria-checked={selected}
      accessibilityLabel={`${option.label}${countLabel}`}
      hitSlop={comfortable ? undefined : { top: (MIN_TARGET - HEIGHT) / 2, bottom: (MIN_TARGET - HEIGHT) / 2 }}
      style={[
        {
          flex: fill ? 1 : undefined,
          height: comfortable ? MIN_TARGET : HEIGHT - 6,
          // Stretched segments share a phone-width track, so they trade padding for label room.
          paddingHorizontal: comfortable ? (fill ? 10 : 18) : (fill ? 6 : 12),
          minWidth: 0,
          borderRadius: comfortable ? 10 : 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: comfortable ? 8 : fill ? 4 : 6,
          backgroundColor: selected ? palette.cardBg : "transparent",
          outlineWidth: focused ? 2 : 0,
          outlineStyle: "solid",
          outlineColor: palette.focusRing,
          outlineOffset: 1,
        },
        selected ? SELECTED_SHADOW : null,
        SEGMENT_WEB,
      ]}
    >
      <Text
        className={fill ? "shrink font-semibold" : "font-semibold"}
        numberOfLines={1}
        style={{ color, fontSize: comfortable ? 17 : fill ? 14.5 : 15 }}
      >
        {option.label}
      </Text>
      {typeof option.count === "number" ? (
        <Text
          className="font-semibold"
          style={{ color: selected ? palette.primary : palette.subtle, fontVariant: ["tabular-nums"], fontSize: comfortable ? 15 : 14 }}
        >
          {option.count}
        </Text>
      ) : null}
    </Pressable>
  );
};

/**
 * A small set of mutually exclusive filters (period, status). Selection changes colour only, so it
 * never shifts the layout around it.
 */
const SegmentedControl = <T extends string,>({
  palette,
  label,
  value,
  options,
  onChange,
  fill = false,
  size = "sm",
  wrap = false,
}: SegmentedControlProps<T>) => (
  <View
    role="radiogroup"
    accessibilityLabel={label}
    style={{
      alignSelf: fill ? "stretch" : "flex-start",
      height: wrap ? undefined : size === "md" ? MIN_TARGET + 8 : HEIGHT,
      flexWrap: wrap ? "wrap" : "nowrap",
      maxWidth: "100%",
      padding: 3,
      borderRadius: size === "md" ? 12 : 10,
      flexDirection: "row",
      gap: 2,
      backgroundColor: palette.divider,
      borderWidth: 1,
      borderColor: palette.cardBorder,
    }}
  >
    {options.map((option) => (
      <Segment
        key={option.value}
        palette={palette}
        option={option}
        selected={option.value === value}
        onSelect={onChange}
        fill={fill}
        size={size}
      />
    ))}
  </View>
);

export default SegmentedControl;
