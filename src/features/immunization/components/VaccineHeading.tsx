import { useState } from "react";
import { Text, View } from "react-native";
import IconButton from "@/components/buttons/IconButton";
import type { Schedule } from "../types";
import useImmunizationStyles from "./immunizationStyles";

export default function VaccineHeading({
  vaccine,
}: {
  vaccine: Schedule["vaccines"][number];
}) {
  const [expanded, setExpanded] = useState(false);
  const { styles } = useImmunizationStyles();
  return (
    <View style={styles.section}>
      <View style={styles.compactRow}>
        <Text style={[styles.strong, styles.grow]}>{vaccine.name}</Text>
        <IconButton
          icon={expanded ? "chevron-up" : "info"}
          size={44}
          label={`${expanded ? "Hide" : "Show"} ${vaccine.name} vaccine information`}
          onPress={() => setExpanded(!expanded)}
        />
      </View>
      {vaccine.key === "opv" ? (
        <Text style={styles.muted}>Given by mouth</Text>
      ) : null}
      {expanded ? (
        <View style={styles.section}>
          <Text style={styles.muted}>SAKIT NA MAIIWASAN</Text>
          <Text style={styles.body}>{vaccine.disease}</Text>
          <Text style={styles.body}>Route: {vaccine.route}</Text>
        </View>
      ) : null}
    </View>
  );
}
