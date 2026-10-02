import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import DashboardRoleBadge from "@/components/dashboard/admin/DashboardRoleBadge";
import Checkbox from "@/components/ui/Checkbox";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MenuAnchor, User } from "../../userAdmin.types";
import { ACCESS_LABELS, roleToApi } from "../../userAdminModel";
import UserIdentity from "../ui/UserIdentity";
import UserStatusPill from "../ui/UserStatusPill";
import { CardSide } from "@/components/dashboard/kit/TableCard";
import RowMenuButton from "../wide/RowMenuButton";

type PhoneUserRowProps = {
  user: User;
  first: boolean;
  selecting: boolean;
  selected: boolean;
  menuOpen: boolean;
  onToggle: (id: string) => void;
  onOpenProfile: (id: string) => void;
  onOpenMenu: (id: string, anchor: MenuAnchor | null) => void;
};

/**
 * A stacked row inside the list card, as the dashboard's tables stack on
 * phones. Tap opens the profile; long press starts selecting, and while
 * selecting a tap checks or unchecks the row instead.
 */
const PhoneUserRow = ({ user, first, selecting, selected, menuOpen, onToggle, onOpenProfile, onOpenMenu }: PhoneUserRowProps) => {
  const palette = useAdminSurfacePalette();
  return (
    <View className="mx-4">
      <CardSide>
        <View className={`flex-row items-center gap-1 rounded-sm py-3 pl-1 ${first ? "" : "border-t border-divider"} ${selected ? "bg-selected" : ""}`}>
          {selecting ? (
            <View className="mr-2">
              <Checkbox checked={selected} onChange={() => onToggle(user.id)} accessibilityLabel={`Select ${user.fullName}`} />
            </View>
          ) : null}
          <Pressable
            onPress={() => (selecting ? onToggle(user.id) : onOpenProfile(user.id))}
            onLongPress={() => onToggle(user.id)}
            accessibilityRole="button"
            accessibilityLabel={user.fullName}
            accessibilityHint={selecting ? "Selects or clears this user" : "Opens the profile. Long press to select"}
            className="min-w-0 flex-1 gap-2 web:cursor-pointer"
          >
            <UserIdentity large name={user.fullName} avatarUrl={user.avatarUrl} detail={user.email} />
            <View className="flex-row flex-wrap items-center gap-2 pl-[52px]">
              <DashboardRoleBadge role={roleToApi(user.role)} palette={palette} isDark={palette.isDark} />
              <UserStatusPill status={user.status} />
              <Text className="text-[12px] font-medium text-text2">{ACCESS_LABELS[user.access]}</Text>
            </View>
          </Pressable>
          {selecting ? null : (
            <RowMenuButton name={user.fullName} open={menuOpen} popover={false} onOpen={() => onOpenMenu(user.id, null)} />
          )}
        </View>
      </CardSide>
    </View>
  );
};

export default memo(PhoneUserRow);
