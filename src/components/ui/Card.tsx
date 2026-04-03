import type { ReactNode } from "react";

import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export type CardProps = {
  children: ReactNode;
  className?: string;
};

const Card = ({ children, className = "" }: CardProps) => {
  const { classes } = useTheme();

  return (
    <View className={[classes.card, className].filter(Boolean).join(" ")}>
      {children}
    </View>
  );
};

export default Card;
