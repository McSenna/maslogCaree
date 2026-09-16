import { Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

type Props = {
  label: string;
  value: string;
  capitalize?: boolean;
  size?: "sm" | "md";
  className?: string;
};

const InfoTile = ({
  label,
  value,
  capitalize = false,
  size = "sm",
  className = "",
}: Props) => {
  const { classes } = useTheme();

  return (
    <View
      className={`p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 ${className}`}
    >
      <Text
        className={`text-[11px] font-semibold uppercase tracking-wider ${classes.textMuted}`}
      >
        {label}
      </Text>
      <Text
        className={`${size === "md" ? "text-[13.5px]" : "text-[13px]"} font-medium mt-0.5 ${
          capitalize ? "capitalize " : ""
        }${classes.textPrimary}`}
      >
        {value}
      </Text>
    </View>
  );
};

export default InfoTile;
