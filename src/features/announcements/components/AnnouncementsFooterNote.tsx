import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import LegalLinks from "@/features/legal/components/LegalLinks";

const AnnouncementsFooterNote = ({ isTablet }: { isTablet: boolean }) => {
  return (
    <View className="flex-row items-center justify-center gap-2 py-3">
      <View className="rounded-full p-1.5" style={{ backgroundColor: "#F1F5F9" }}>
        <Feather name="info" size={11} color="#94A3B8" />
      </View>
      <Text className="text-slate-500" style={{ fontSize: isTablet ? 12 : 11 }}>
        All events are free for Barangay Maslog residents
      </Text>
    </View>
  );
};

/** The public pages' footer: the free-events note, then the legal links. */
export const PublicFooter = ({ isTablet }: { isTablet: boolean }) => {
  return (
    <View className="gap-2 pb-2">
      <AnnouncementsFooterNote isTablet={isTablet} />
      <LegalLinks />
    </View>
  );
};

export default AnnouncementsFooterNote;
