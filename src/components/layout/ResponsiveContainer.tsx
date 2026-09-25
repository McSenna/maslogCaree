import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { CONTENT_MAX_WIDTH } from "@/theme/breakpoints";

type ResponsiveContainerProps = {
  children: ReactNode;
  maxWidth?: number;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

const ResponsiveContainer = ({
  children,
  maxWidth = CONTENT_MAX_WIDTH,
  padded = true,
  style,
}: ResponsiveContainerProps) => {
  const { pagePadding } = useResponsive();

  return (
    <View
      style={[
        {
          width: "100%",
          maxWidth,
          alignSelf: "center",
          minWidth: 0,
          paddingHorizontal: padded ? pagePadding : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ResponsiveContainer;
