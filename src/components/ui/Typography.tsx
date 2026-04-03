import { ReactNode } from "react";
import { Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

export function PageTitle({ children, className = "" }: TypographyProps) {
  const { classes } = useTheme();

  return (
    <Text
      className={`text-2xl font-bold tracking-tight md:text-3xl ${classes.textPrimary} ${className}`}
    >
      {children}
    </Text>
  );
}

export function PageSubtitle({ children, className = "" }: TypographyProps) {
  const { classes } = useTheme();

  return (
    <Text
      className={`mt-1 text-sm font-medium md:text-base ${classes.textAccent} ${className}`}
    >
      {children}
    </Text>
  );
}

export function Paragraph({ children, className = "" }: TypographyProps) {
  const { classes } = useTheme();

  return (
    <Text
      className={`text-sm leading-relaxed md:text-base ${classes.textSecondary} ${className}`}
    >
      {children}
    </Text>
  );
}
