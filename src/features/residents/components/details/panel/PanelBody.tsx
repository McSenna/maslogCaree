import { ScrollView, Text, View } from "react-native";

import DetailCard from "@/features/users/components/details/DetailCard";
import UserDetailsError from "@/features/users/components/details/UserDetailsError";
import { InfoRows } from "@/features/users/components/details/userDetailRows";
import { DETAIL_RADIUS, useUserDetailsPalette } from "@/features/users/components/details/detailsTheme";

import type { ResidentRecord } from "../../../services/residentService";
import ResidentProfileSummary from "../ResidentProfileSummary";
import { buildAccountRows, buildAddressRows, buildContactRows } from "../residentDetailRows";

type Props = {
  resident: ResidentRecord | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  compact: boolean;
};

export const PanelBody = ({ resident, loading, error, onRetry, compact }: Props) => {
  const palette = useUserDetailsPalette();

  return (
    <ScrollView
      className="w-full"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 28 }}
    >
      {error && !resident ? (
        <UserDetailsError onRetry={onRetry} message={error} />
      ) : !resident || loading ? (
        <View className="w-full items-center py-16">
          <Text className="text-[14px]" style={{ color: palette.muted }}>
            Loading resident details…
          </Text>
        </View>
      ) : (
        <View className="w-full gap-5">
          <View
            className="w-full border"
            style={{
              borderRadius: DETAIL_RADIUS.hero,
              backgroundColor: palette.heroTop,
              borderColor: palette.heroBorder,
              paddingBottom: 12,
            }}
          >
            <ResidentProfileSummary resident={resident} />
          </View>

          <View className={`w-full gap-5 ${compact ? "flex-col" : "flex-row items-stretch"}`}>
            <View className="min-w-0 flex-1 gap-5">
              <DetailCard icon="phone" title="Contact Information">
                <InfoRows rows={buildContactRows(resident)} />
              </DetailCard>
              <DetailCard icon="file-text" title="Account Information" grow>
                <InfoRows rows={buildAccountRows(resident)} />
              </DetailCard>
            </View>
            <View className="min-w-0 flex-1">
              <DetailCard icon="map-pin" title="Address" grow>
                <InfoRows rows={buildAddressRows(resident)} />
              </DetailCard>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
