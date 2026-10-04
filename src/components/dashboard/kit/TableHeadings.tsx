import type { ReactNode } from "react";
import { Text, View } from "react-native";

/**
 * The column heading band at the top of a TableCard. Square at the bottom and
 * closed by a divider, so it reads as the head of the rows below rather than
 * a separate strip. Labels sit in body colour, a step quieter than row titles
 * (ink) but crisp enough to scan by.
 */
export const TableHeadings = ({ children }: { children: ReactNode }) => (
  <View className="min-h-10 flex-row items-center gap-3 rounded-t-control border-b border-divider bg-head px-3 py-2.5">
    {children}
  </View>
);

export const HeadingCell = ({ label, className = "" }: { label: string; className?: string }) => (
  <Text numberOfLines={1} className={`text-[12px] font-semibold tracking-[0.2px] text-body ${className}`}>
    {label}
  </Text>
);
