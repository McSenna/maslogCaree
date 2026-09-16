import { View } from "react-native";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";

type RoleScreenBackdropProps = {
  color: string;
  insets: Pick<RoleScreenInsets, "layoutPadding">;
};

const RoleScreenBackdrop = ({ color, insets }: RoleScreenBackdropProps) => {
  const { layoutPadding } = insets;

  return (
    <View
      style={{
        position: "absolute",
        top: -layoutPadding.top,
        bottom: -layoutPadding.bottom,
        left: -layoutPadding.horizontal,
        right: -layoutPadding.horizontal,
        backgroundColor: color,
      }}
    />
  );
};

export default RoleScreenBackdrop;
