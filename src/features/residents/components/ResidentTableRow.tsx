import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import UserStatusBadge from "@/features/users/components/UserStatusBadge";
import { useUsersPalette } from "@/features/users/components/usersTheme";
import { formatDate } from "@/utils/dateFormatter";
import type { ResidentRecord } from "../services/residentService";
import { NOT_PROVIDED, formatContactNumber, residentAddress } from "./residentDisplay";
import { RESIDENT_COLUMNS } from "./residentsLayout";

type ResidentTableRowProps = {
  resident: ResidentRecord;
  isSelected: boolean;
  onSelect: () => void;
  isLast: boolean;
};

const Cell = ({ children, flex }: { children: ReactNode; flex: number }) => (
  <View className="justify-center px-3" style={{ flex, minWidth: 0 }}>
    {children}
  </View>
);

const ResidentTableRow = ({ resident, isSelected, onSelect, isLast }: ResidentTableRowProps) => {
  const palette = useUsersPalette();
  const [hovered, setHovered] = useState(false);

  const background = isSelected
    ? palette.rowSelected
    : hovered
      ? palette.subtleSurface
      : palette.cardBg;

  return (
    <Pressable
      onPress={onSelect}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${resident.fullname}`}
      accessibilityState={{ selected: isSelected }}
      className="w-full flex-row items-center"
      style={{
        minHeight: 68,
        backgroundColor: background,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <Cell flex={RESIDENT_COLUMNS.resident}>
        <View className="flex-row items-center gap-2.5">
          <UserAvatar
            size={40}
            imageUrl={resident.profilePhoto}
            initials={initialsFrom(resident.fullname)}
            accessibilityLabel={`${resident.fullname} profile photo`}
            fallbackBackgroundColor={palette.primary}
          />
          <View className="min-w-0 flex-1">
            <Text
              className="text-[14px] font-bold"
              numberOfLines={1}
              style={{
                color: hovered ? palette.primary : palette.heading,
                textDecorationLine: hovered ? "underline" : "none",
              }}
            >
              {resident.fullname}
            </Text>
            <Text className="mt-0.5 text-[12px]" numberOfLines={1} style={{ color: palette.subtle }}>
              {resident.reference}
            </Text>
          </View>
        </View>
      </Cell>

      <Cell flex={RESIDENT_COLUMNS.contact}>
        <Text className="text-[13px] font-medium" numberOfLines={1} style={{ color: palette.body }}>
          {formatContactNumber(resident.phone)}
        </Text>
        <Text className="mt-0.5 text-[12px]" numberOfLines={1} style={{ color: palette.muted }}>
          {resident.email || NOT_PROVIDED}
        </Text>
      </Cell>

      <Cell flex={RESIDENT_COLUMNS.address}>
        <Text className="text-[13px] font-medium" numberOfLines={2} style={{ color: palette.body }}>
          {residentAddress(resident)}
        </Text>
      </Cell>

      <Cell flex={RESIDENT_COLUMNS.status}>
        <UserStatusBadge status={resident.status} compact />
      </Cell>

      <Cell flex={RESIDENT_COLUMNS.registered}>
        <Text className="text-[13px] font-medium" numberOfLines={1} style={{ color: palette.body }}>
          {formatDate(resident.createdAt)}
        </Text>
      </Cell>
    </Pressable>
  );
};

export default ResidentTableRow;
