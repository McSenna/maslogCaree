import { useEffect, useRef, type ReactNode } from "react";
import { Platform, Text, View, type TextStyle } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";

import { useCellSelfAlign, useCellTextAlign } from "./TablePlacement";
import { TABLE_TEXT } from "./tableTokens";
import type { Align } from "./types";

type TitledNode = { setAttribute?: (name: string, value: string) => void };

/** On the web, a truncated value shows in full as the browser tooltip. */
const useWebTitle = (title: string) => {
  const ref = useRef<Text>(null);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    (ref.current as unknown as TitledNode | null)?.setAttribute?.("title", title);
  }, [title]);
  return ref;
};

type TableTextProps = {
  value: string;
  tone?: "body" | "muted" | "heading" | "danger";
  weight?: "regular" | "strong";
  align?: Align;
  lines?: number;
  selectable?: boolean;
};

/** Cell text: one line with an ellipsis, and the full value for screen readers and tooltips. */
export const TableText = ({
  value,
  tone = "body",
  weight = "regular",
  align,
  lines = 1,
  selectable = false,
}: TableTextProps) => {
  const colors = useThemeColors();
  const cellAlign = useCellTextAlign();
  const ref = useWebTitle(value);
  const color = tone === "danger" ? colors.danger.fg : colors[tone];
  const style: TextStyle = weight === "strong" ? { ...TABLE_TEXT.cell, fontWeight: "600" } : TABLE_TEXT.cell;

  return (
    <Text
      ref={ref}
      numberOfLines={lines}
      selectable={selectable}
      accessibilityLabel={value}
      style={[style, { color, textAlign: align ?? cellAlign }]}
    >
      {value}
    </Text>
  );
};

type PrimaryCellProps = {
  title: string;
  /** The record ID, or other identifying detail. */
  detail?: string;
  detailSelectable?: boolean;
};

/** The first column: a name over its ID, centred as one block. */
export const TablePrimaryCell = ({ title, detail, detailSelectable = true }: PrimaryCellProps) => {
  const colors = useThemeColors();
  const textAlign = useCellTextAlign();
  const titleRef = useWebTitle(title);
  const detailRef = useWebTitle(detail ?? "");

  return (
    <View className="min-w-0 gap-0.5 self-stretch">
      <Text
        ref={titleRef}
        numberOfLines={1}
        accessibilityLabel={title}
        style={[TABLE_TEXT.primary, { color: colors.heading, textAlign }]}
      >
        {title}
      </Text>
      {detail ? (
        <Text
          ref={detailRef}
          numberOfLines={1}
          selectable={detailSelectable}
          accessibilityLabel={detail}
          style={[TABLE_TEXT.secondary, { color: colors.muted, textAlign }]}
        >
          {detail}
        </Text>
      ) : null}
    </View>
  );
};

type TwoLineProps = { value: string; detail?: string; tone?: "body" | "muted"; align?: Align };

type CellRowProps = { children: ReactNode; className?: string };

/** An avatar or icon beside text, as one block that follows the cell's alignment: centred in a table, left on a card. */
export const TableCellRow = ({ children, className = "" }: CellRowProps) => {
  const justifyContent = useCellSelfAlign();
  return (
    <View className={`min-w-0 flex-row items-center self-stretch ${className}`} style={{ justifyContent }}>
      {children}
    </View>
  );
};

/** A value over a muted detail, e.g. a date over its time. */
export const TableTwoLine = ({ value, detail, tone = "body", align }: TwoLineProps) => {
  const colors = useThemeColors();
  const cellAlign = useCellTextAlign();
  const textAlign = align ?? cellAlign;
  return (
    <View className="min-w-0 gap-0.5 self-stretch">
      <TableText value={value} tone={tone} align={textAlign} />
      {detail ? (
        <Text numberOfLines={1} style={[TABLE_TEXT.secondary, { color: colors.muted, textAlign }]}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
};
