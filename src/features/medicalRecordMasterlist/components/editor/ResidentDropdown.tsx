import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { PALETTE } from "@/theme/palette";

import type { ResidentIdentity } from "../../types";
import { identityFacts } from "./IdentityOption";

// About five rows; longer lists scroll inside the panel.
const MAX_HEIGHT = 300;

type Props = {
  results: ResidentIdentity[];
  searching: boolean;
  error: string | null;
  activeIndex: number;
  onHover: (index: number) => void;
  onPick: (identity: ResidentIdentity) => void;
  capped: boolean;
};

/** The search box's results, attached directly below it like a select menu. */
const ResidentDropdown = ({ results, searching, error, activeIndex, onHover, onPick, capped }: Props) => {
  const palette = useAdminSurfacePalette();
  const note = (message: string, color = palette.muted) => (
    <View className="flex-row items-center gap-2.5 px-3.5 py-3">
      {searching && results.length === 0 ? <ActivityIndicator size="small" color={palette.primary} /> : null}
      <Text className="min-w-0 flex-1 text-[12.5px] leading-[18px]" style={{ color }}>
        {message}
      </Text>
    </View>
  );

  const body = () => {
    if (error) return note(error, PALETTE.red[600]);
    if (searching && results.length === 0) return note("Searching the master list.");
    if (results.length === 0) {
      return note("No active resident on the master list matches. Check the spelling, or ask an admin to add the person first.");
    }
    return results.map((identity, index) => {
      const active = index === activeIndex;
      return (
        <Pressable
          key={identity.masterResidentId ?? `${identity.fullName}-${index}`}
          onPress={() => onPick(identity)}
          onHoverIn={() => onHover(index)}
          accessibilityRole="button"
          accessibilityLabel={`Choose ${identity.fullName}, ${identityFacts(identity)}`}
          className="min-h-12 justify-center gap-0.5 px-3.5 py-2.5"
          style={{
            backgroundColor: active ? palette.hoverBg : palette.cardBg,
            borderTopWidth: index === 0 ? 0 : 1,
            borderTopColor: palette.divider,
          }}
        >
          <Text className="text-[14px] font-semibold" style={{ color: active ? palette.primary : palette.heading }}>
            {identity.fullName}
          </Text>
          <Text className="text-[12.5px] leading-[18px]" style={{ color: palette.muted }}>
            {identityFacts(identity)}
          </Text>
        </Pressable>
      );
    });
  };

  return (
    <View
      accessibilityRole="list"
      accessibilityLabel="Matching residents"
      className="overflow-hidden border border-t-0"
      style={{
        maxHeight: MAX_HEIGHT,
        borderColor: palette.primary,
        backgroundColor: palette.cardBg,
        borderBottomLeftRadius: RADIUS.control,
        borderBottomRightRadius: RADIUS.control,
      }}
    >
      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
        {body()}
        {capped && results.length > 0 ? (
          <Text className="px-3.5 pb-2.5 pt-2 text-[11.5px]" style={{ color: palette.subtle, borderTopWidth: 1, borderTopColor: palette.divider }}>
            Showing the first {results.length} matches. Type more of the name to narrow the list.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default ResidentDropdown;
