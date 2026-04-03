import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Image, Text, View } from "react-native";
import Chip from "@/components/ui/Chip";

export type ProfileIdentityData = {
  fullname: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  verified?: boolean;
  address?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
};

function normalizeImageUrl(url?: string | null) {
  if (!url) return null;
  const trimmed = url.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function InfoRow({
  icon,
  value,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-sky-50">
        <Feather name={icon} size={14} color="#0EA5E9" />
      </View>
      <Text className="flex-1 text-[13px] font-semibold text-slate-700" numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const ProfileIdentityCard = ({ user }: { user: ProfileIdentityData }) => {
  const uri = useMemo(() => normalizeImageUrl(user.avatarUrl), [user.avatarUrl]);
  const [hasError, setHasError] = useState(false);

  const showFallback = !uri || hasError;

  return (
    <View className="overflow-hidden rounded-3xl border border-slate-100 bg-white">
      <View className="flex-row items-center gap-4 px-5 py-5">
        <View className="h-[76px] w-[76px] overflow-hidden rounded-full bg-sky-100">
          {showFallback ? (
            <View className="h-full w-full items-center justify-center">
              <Feather name="user" size={30} color="#0284C7" />
            </View>
          ) : (
            <Image
              source={{ uri: uri! }}
              onError={() => setHasError(true)}
              resizeMode="cover"
              style={{ width: 76, height: 76 }}
              accessibilityLabel="Profile photo"
            />
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="max-w-[100%] text-[18px] font-extrabold tracking-tight text-slate-900" numberOfLines={1}>
              {user.fullname}
            </Text>
            <Chip label={user.role} />
            {user.verified ? (
              <View className="flex-row items-center gap-1 rounded-full bg-emerald-50 px-2 py-1">
                <Feather name="check-circle" size={12} color="#10B981" />
                <Text className="text-[11px] font-bold text-emerald-700">Verified</Text>
              </View>
            ) : null}
          </View>

          <View className="mt-1 flex-row items-center gap-2">
            <Feather name="mail" size={12} color="#64748B" />
            <Text className="text-[12px] font-semibold text-slate-600" numberOfLines={1}>
              {user.email}
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-3 border-t border-slate-100 px-5 py-4">
        <InfoRow icon="map-pin" value={user.address ?? null} />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <InfoRow icon="user" value={user.gender ?? null} />
          </View>
          <View className="flex-1">
            <InfoRow icon="calendar" value={user.dateOfBirth ?? null} />
          </View>
        </View>
      </View>
    </View>
  );
}

export default ProfileIdentityCard