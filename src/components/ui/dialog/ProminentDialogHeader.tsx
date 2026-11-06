import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import { useInteractionState } from "@/hooks/useInteractionState";
import { RADII } from "@/theme/radius";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import type { DialogHeaderProps } from "./DialogHeader";

const WEB = webStyle({ cursor: "pointer" });

/**
 * The larger header for a task dialog that opens a multi-step form: a rounded
 * icon tile, a headline and a plain close button. No rule underneath, so a
 * stepper in the subheader can sit right under the title.
 */
export const ProminentDialogHeader = ({ palette, title, subtitle, icon, tint, tintSoft, titleId, onClose }: DialogHeaderProps) => {
  const { hovered, focused, handlers } = useInteractionState();
  return (
    <View className="flex-row items-start gap-4 px-6 pb-2 pt-5">
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        aria-hidden
        className="h-12 w-12 items-center justify-center"
        style={{ borderRadius: RADII.medium, backgroundColor: tintSoft ?? palette.accentSoft }}
      >
        <Feather name={icon} size={22} color={tint ?? palette.accent} />
      </View>
      <View className="min-w-0 flex-1 pt-0.5">
        <Text nativeID={titleId} accessibilityRole="header" style={[TYPE.headline, { color: palette.heading }]}>
          {title}
        </Text>
        {subtitle ? <Text style={[TYPE.bodyLarge, { color: palette.body }]}>{subtitle}</Text> : null}
      </View>
      <Pressable
        {...handlers}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
        className="h-11 w-11 items-center justify-center"
        style={[{ borderRadius: RADII.small, backgroundColor: hovered ? palette.card : "transparent" }, focused ? focusRing(palette.accent) : null, WEB]}
      >
        <Feather name="x" size={24} color={palette.body} />
      </Pressable>
    </View>
  );
};

export default ProminentDialogHeader;
