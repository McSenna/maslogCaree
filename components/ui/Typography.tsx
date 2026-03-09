import { ReactNode } from "react";
import { Text } from "react-native";

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

export function PageTitle({ children, className = "" }: TypographyProps) {
  return (
    <Text
      className={`text-2xl font-bold tracking-tight text-slate-900 md:text-3xl ${className}`}
    >
      {children}
    </Text>
  );
}

export function PageSubtitle({ children, className = "" }: TypographyProps) {
  return (
    <Text
      className={`mt-1 text-sm font-medium text-sky-700 md:text-base ${className}`}
    >
      {children}
    </Text>
  );
}

export function Paragraph({ children, className = "" }: TypographyProps) {
  return (
    <Text
      className={`text-sm leading-relaxed text-slate-600 md:text-base ${className}`}
    >
      {children}
    </Text>
  );
}

