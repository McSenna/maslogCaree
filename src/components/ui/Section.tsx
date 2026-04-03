import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type SectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Section({
  eyebrow,
  title,
  subtitle,
  right,
  children,
  className = "",
}: SectionProps) {
  const { classes } = useTheme();

  return (
    <View className={["gap-3", className].join(" ")}>
      <View className="flex-row items-end justify-between gap-3">
        <View className="flex-1">
          {eyebrow ? (
            <Text className={classes.sectionEyebrow}>{eyebrow}</Text>
          ) : null}
          <Text className={classes.sectionTitle}>{title}</Text>
          {subtitle ? (
            <Text className={classes.sectionSubtitle}>{subtitle}</Text>
          ) : null}
        </View>
        {right ? <View className="shrink-0">{right}</View> : null}
      </View>
      {children}
    </View>
  );
}
