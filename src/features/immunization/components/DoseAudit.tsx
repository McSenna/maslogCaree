import { useState } from "react";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import type { DoseRecord } from "../types";
import useImmunizationStyles from "./immunizationStyles";

const timestamp = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        dateStyle: "medium",
        timeStyle: "short",
      });
};
export default function DoseAudit({ record }: { record: DoseRecord }) {
  const { styles } = useImmunizationStyles();
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.section}>
      <Button
        label={expanded ? "Hide audit history" : "Show audit history"}
        variant="secondary"
        icon={expanded ? "chevron-up" : "clock"}
        onPress={() => setExpanded(!expanded)}
      />
      {expanded ? (
        <View style={styles.section}>
          <Text style={styles.body}>
            Recording midwife ID: {record.recordedBy || "Not recorded"}
          </Text>
          <Text style={styles.body}>
            Created: {timestamp(record.createdAt)} (Asia/Manila)
          </Text>
          <Text style={styles.body}>
            Last updated: {timestamp(record.updatedAt)} · Revision{" "}
            {record.revision}
          </Text>
          {record.history.map((entry, index) => (
            <View key={`${entry.at}-${index}`} style={styles.divider}>
              <Text style={styles.strong}>
                {entry.action} · {timestamp(entry.at)}
              </Text>
              <Text style={styles.body}>{entry.reason}</Text>
              <Text style={styles.muted}>
                Recording midwife ID: {entry.actor}
              </Text>
              {entry.previous ? (
                <View style={styles.section}>
                  <Text style={styles.strong}>Previous saved values</Text>
                  {Object.entries(entry.previous).map(([key, value]) => (
                    <Text key={key} style={styles.body}>
                      {key}:{" "}
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value ?? "Not recorded")}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
