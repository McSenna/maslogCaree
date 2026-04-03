import type { ReactNode } from "react";
import { Text, View } from "react-native";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";

type ChartCardProps = {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function ChartCard({ title, right, children, className = "" }: ChartCardProps) {
  const { classes } = useTheme();

  return (
    <Card className={`p-4 md:p-5 ${className}`}>
      <View className="mb-3 flex-row items-center justify-between gap-2">
        <Text className={`text-base font-bold md:text-lg ${classes.textPrimary}`}>
          {title}
        </Text>
        {right ? <View className="shrink-0">{right}</View> : null}
      </View>
      {children}
    </Card>
  );
}
