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
      className="flex-1"
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      contentContainerStyle={[
        {
          flexGrow: 1,
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

