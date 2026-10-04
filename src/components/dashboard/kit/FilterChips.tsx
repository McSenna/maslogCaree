import { Feather } from "@expo/vector-icons";
import { Animated, Pressable, Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";

export type ChipOption<T extends string> = {
  value: T;
  label: string;
  /** Series colour, so the chip doubles as the chart legend for that service. */
  swatch?: string;
};

const HEIGHT = 32;
const MIN_TARGET = 44;
const CHIP_WEB = webStyle({
  cursor: "pointer",
  transition: webTransition("background-color", "border-color"),
});

const Chip = <T extends string>({
  palette,
  option,
  selected,
  onSelect,
}: {
  palette: AdminDashboardPalette;
  option: ChipOption<T>;
  selected: boolean;
  onSelect: (value: T) => void;
}) => {
  const { hovered, focused, scaleStyle, handlers } = useInteractionState({
    pressScale: 0.97,
  });

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        {...handlers}
        onPress={() => onSelect(option.value)}
        role="radio"
        aria-checked={selected}
        accessibilityLabel={option.label}
        hitSlop={{
          top: (MIN_TARGET - HEIGHT) / 2,
          bottom: (MIN_TARGET - HEIGHT) / 2,
        }}
        style={[
          {
            height: HEIGHT,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            borderColor: selected
              ? palette.primary
              : hovered
                ? palette.subtle
                : palette.cardBorder,
            backgroundColor: selected
              ? palette.tones.primary.cardBg
              : palette.cardBg,
            outlineWidth: focused ? 2 : 0,
            outlineStyle: "solid",
            outlineColor: palette.focusRing,
            outlineOffset: 2,
          },
          CHIP_WEB,
        ]}
      >
        {selected ? (
          <Feather name="check" size={13} color={palette.primary} />
        ) : option.swatch ? (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: option.swatch,
            }}
          />
        ) : null}
        <Text
          className="text-[13px] font-semibold"
          numberOfLines={1}
          style={{ color: selected ? palette.primary : palette.body }}
        >
          {option.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

/** Single-choice filter chips, used where the options are named things (services, roles). */
const FilterChips = <T extends string>({
  palette,
  label,
  value,
  options,
  onChange,
}: {
  palette: AdminDashboardPalette;
  label: string;
  value: T;
  options: readonly ChipOption<T>[];
  onChange: (value: T) => void;
}) => (
  <View
    role="radiogroup"
    accessibilityLabel={label}
    className="flex-row flex-wrap"
    style={{ gap: 8 }}
  >
    {options.map((option) => (
      <Chip
        key={option.value}
        palette={palette}
        option={option}
        selected={option.value === value}
        onSelect={onChange}
      />
    ))}
  </View>
);

export default FilterChips;
