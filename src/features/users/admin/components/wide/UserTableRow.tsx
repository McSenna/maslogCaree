import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import DashboardRoleBadge from "@/components/dashboard/admin/DashboardRoleBadge";
import Checkbox from "@/components/ui/Checkbox";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MenuAnchor, User } from "../../userAdmin.types";
import { ACCESS_LABELS, roleToApi } from "../../userAdminModel";
import { lastLoginLines } from "../../userDates";
import UserIdentity from "../ui/UserIdentity";
import UserStatusPill from "../ui/UserStatusPill";
import NameButton from "./NameButton";
import RowMenuButton from "./RowMenuButton";
import { COLUMN, type TableMode } from "./tableColumns";
import { CardSide } from "@/components/dashboard/kit/TableCard";

type UserTableRowProps = {
  user: User;
  mode: TableMode;
  first: boolean;
  selected: boolean;
  menuOpen: boolean;
  onToggle: (id: string) => void;
  onOpenProfile: (id: string) => void;
  onOpenMenu: (id: string, anchor: MenuAnchor | null) => void;
};

/** The second line under the name: the email, plus whatever columns this width folds in. */
const secondLine = (user: User, mode: TableMode): string => {
  if (mode === "full") return user.email;
  const access = `${user.email} · ${ACCESS_LABELS[user.access]}`;
  return mode === "laptop" || !user.location ? access : `${access} · ${user.location}`;
};

const UserTableRow = ({ user, mode, first, selected, menuOpen, onToggle, onOpenProfile, onOpenMenu }: UserTableRowProps) => {
  const palette = useAdminSurfacePalette();
  const login = lastLoginLines(user.lastLoginAt);

  return (
    <CardSide>
      {/* Hover tint only; the row itself is not a control, its checkbox, name and menu are. */}
      <Pressable
        accessible={false}
        focusable={false}
        className={`min-h-16 flex-row items-center gap-3 rounded-sm px-3 py-2.5 ${first ? "" : "border-t border-divider"} ${selected ? "bg-selected" : "hover:bg-rowopen"}`}
      >
        <View className={COLUMN.check}>
          <Checkbox checked={selected} onChange={() => onToggle(user.id)} accessibilityLabel={`Select ${user.fullName}`} />
        </View>
        <View className={COLUMN.user}>
          <UserIdentity
            name={user.fullName}
            avatarUrl={user.avatarUrl}
            detail={secondLine(user, mode)}
            nameSlot={<NameButton name={user.fullName} onPress={() => onOpenProfile(user.id)} />}
          />
        </View>
        <View className={`${COLUMN.role} items-start`}>
          <DashboardRoleBadge role={roleToApi(user.role)} palette={palette} isDark={palette.isDark} />
        </View>
        {mode === "full" ? <Text className={`${COLUMN.access} text-[13px] font-medium text-body`}>{ACCESS_LABELS[user.access]}</Text> : null}
        {mode === "tablet" ? null : (
          <Text numberOfLines={2} className={`${COLUMN.location} text-[13px] font-normal leading-[18px] text-body`}>
            {user.location || "Not recorded"}
          </Text>
        )}
        <View className={`${COLUMN.status} items-start`}>
          <UserStatusPill status={user.status} />
        </View>
        <View className={COLUMN.lastLogin}>
          <Text className={`text-[13px] font-medium ${login.time ? "text-ink" : "text-text2"}`}>{login.date}</Text>
          {login.time ? <Text className="text-[12px] font-normal text-text2">{login.time}</Text> : null}
        </View>
        <View className={COLUMN.actions}>
          <RowMenuButton name={user.fullName} open={menuOpen} popover onOpen={(anchor) => onOpenMenu(user.id, anchor)} />
        </View>
      </Pressable>
    </CardSide>
  );
};

export default memo(UserTableRow);
