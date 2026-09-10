import { Text, View } from "react-native";
import type { OrganizationMember } from "@/types/organization";
import { BHW_COLUMNS, HC } from "../constants/aboutTheme";
import { toGridRows } from "../utils/organizationChart";
import BhwCard from "./BhwCard";

type BhwGridProps = {
  members: OrganizationMember[];
  isTablet: boolean;
};

/**
 * The health workers, three to a row.
 *
 * A short final row is padded with empty flex boxes rather than left to
 * stretch, so the last card keeps the same width as every card above it.
 */
export default function BhwGrid({ members, isTablet }: BhwGridProps) {
  if (members.length === 0) {
    return (
      <Text
        style={{
          color: HC.slateLight,
          fontSize: 14,
          textAlign: "center",
          paddingVertical: 20,
        }}
      >
        No BHW members found.
      </Text>
    );
  }

  return (
    <View style={{ width: "100%", gap: 8 }}>
      {toGridRows(members).map((row, rowIndex) => (
        <View key={row[0].organizationId} style={{ flexDirection: "row", gap: 8 }}>
          {row.map((member, columnIndex) => (
            <BhwCard
              key={member.organizationId}
              member={member}
              index={rowIndex * BHW_COLUMNS + columnIndex}
              isTablet={isTablet}
            />
          ))}
          {row.length < BHW_COLUMNS &&
            Array.from({ length: BHW_COLUMNS - row.length }).map((_, padIndex) => (
              <View key={`pad-${padIndex}`} style={{ flex: 1 }} />
            ))}
        </View>
      ))}
    </View>
  );
}
