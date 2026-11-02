import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import DashboardRoleBadge from "@/components/dashboard/admin/DashboardRoleBadge";
import { CardSide } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { User } from "../../userAdmin.types";
import { roleToApi } from "../../userAdminModel";
import { lastLoginLines } from "../../userDates";
import PortalAccessCell from "../shared/PortalAccessCell";
import UserRowActions, { type UserRowActionHandlers } from "../shared/UserRowActions";
import UserIdentity from "../ui/UserIdentity";
import UserStatusPill from "../ui/UserStatusPill";

type PhoneUserRowProps = UserRowActionHandlers & {
  user: User;
  first: boolean;
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <View className="items-start gap-1">
      <Text className="font-medium text-text2" style={{ fontSize: 14 }}>{label}</Text>
      {children}
    </View>
  );
};

/** The table's columns stacked in a card: a wide table is never squeezed onto a phone. */
const PhoneUserRow = ({ user, first, ...handlers }: PhoneUserRowProps) => {
  const palette = useAdminSurfacePalette();
  const login = lastLoginLines(user.lastLoginAt);
  return (
    <View className="mx-4">
      <CardSide>
        <View className={`gap-3 rounded-sm py-4 pl-1 ${first ? "" : "border-t border-divider"}`}>
          <Pressable
            onPress={() => handlers.onOpenProfile(user.id)}
            accessibilityRole="button"
            accessibilityLabel={user.fullName}
            accessibilityHint="Opens the account"
            className="min-w-0 gap-3 web:cursor-pointer"
          >
            <UserIdentity large name={user.fullName} avatarUrl={user.avatarUrl} />
            <View className="flex-row flex-wrap gap-x-6 gap-y-3 pl-[52px]">
              <Field label="Role">
                <DashboardRoleBadge role={roleToApi(user.role)} palette={palette} isDark={palette.isDark} />
              </Field>
              <Field label="Account status">
                <UserStatusPill status={user.status} />
              </Field>
              <Field label="Portal access">
                <PortalAccessCell state={user.portalAccess.state} />
              </Field>
              <Field label="Last login">
                <Text className="text-body" style={{ fontSize: 15 }}>{login.time ? `${login.date}, ${login.time}` : login.date}</Text>
              </Field>
            </View>
          </Pressable>
          <View className="pl-[52px]">
            <UserRowActions user={user} touch {...handlers} />
          </View>
        </View>
      </CardSide>
    </View>
  );
};

export default memo(PhoneUserRow);
