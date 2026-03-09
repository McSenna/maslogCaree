import type { ReactNode } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";

type ScreenScrollProps = ScrollViewProps & {
  children: ReactNode;
  className?: string;
};

export default function ScreenScroll({
  children,
  contentContainerStyle,
  ...rest
}: ScreenScrollProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      contentContainerStyle={[
        {
          paddingBottom: 16,
        },
        contentContainerStyle,
      ]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

