import type { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { Block, Row } from "@/components/medicalRecord/details/RecordPrimitives";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { TYPE } from "@/theme/typography";

import type { PersonSummary } from "./vaccinationTypes";

export type SummaryShortcut = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  /** The full name when the block's title makes a short visible label enough. */
  accessibilityLabel?: string;
};

/** One labeled person, with the ways to reach their fuller record. */
type Props = { person: PersonSummary; shortcuts?: SummaryShortcut[]; children?: ReactNode };

const PersonSummaryBlock = ({ person, shortcuts = [], children }: Props) => {
  const base = useQueuePalette();
  // Section labels on this clinical record stay readable in both themes.
  const palette = { ...base, subtle: base.body };
  const buttons = useAdminSurfacePalette();
  return (
    <View style={styles.cell}>
      <Block title={person.title} palette={palette} fill>
        {person.rows.map((row) => (
          <Row key={row.label} label={row.label} value={row.value} palette={palette} />
        ))}
        {person.emptyText ? <Text style={[styles.empty, { color: palette.body }]}>{person.emptyText}</Text> : null}
        {children ? <View style={styles.extra}>{children}</View> : null}
        {shortcuts.length ? (
          <View style={styles.shortcuts}>
            {shortcuts.map((shortcut) => (
              <DashboardButton key={shortcut.label} palette={buttons} size="sm" variant="secondary" {...shortcut} />
            ))}
          </View>
        ) : null}
      </Block>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: { flexGrow: 1, flexShrink: 1, flexBasis: 300, minWidth: 0 },
  extra: { paddingTop: 4, paddingBottom: 8 },
  empty: { ...TYPE.body, paddingVertical: 8 },
  shortcuts: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 4, paddingBottom: 8 },
});

export default PersonSummaryBlock;
