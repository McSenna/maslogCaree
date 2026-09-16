import type { ReactNode } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";

type ScreenScrollProps = ScrollViewProps & {
  children: ReactNode;
  className?: string;
  contentBottomInset?: number;
};

const ScreenScroll = ({
  children,
  contentContainerStyle,
  contentBottomInset = 8,
  ...rest
}: ScreenScrollProps) => {
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingBottom: contentBottomInset,
        },
        contentContainerStyle,
      ]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
};

export default ScreenScroll;
