import type { ReactNode } from "react";
import { Pressable, View, type ViewStyle } from "react-native";

import { useInteractionState } from "@/hooks/useInteractionState";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";

const FRAME_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "border-color") });

type MetricCardFrameProps = {
  onPress?: () => void;
  selected: boolean;
  /** Hovered or pressed look for a pressable, unselected card. */
  activeStyle: ViewStyle;
  accessibilityLabel: string;
  accessibilityHint?: string;
  className: string;
  style: ViewStyle;
  children: ReactNode;
};

/** The card's outer surface: a button when it opens something, otherwise one readable block. */
const MetricCardFrame = ({
  onPress,
  selected,
  activeStyle,
  accessibilityLabel,
  accessibilityHint,
  className,
  style,
  children,
}: MetricCardFrameProps) => {
  // Hover tracked in state: NativeWind drops a function `style` on a className'd Pressable.
  const { hovered, pressed, handlers } = useInteractionState({ disabled: !onPress, pressScale: 1 });

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={accessibilityLabel} className={className} style={style}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected }}
      aria-selected={selected}
      className={className}
      style={[style, FRAME_WEB, !selected && (hovered || pressed) ? activeStyle : null]}
    >
      {children}
    </Pressable>
  );
};

export default MetricCardFrame;
