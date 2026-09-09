import { Text, View } from "react-native";
import type { AdminUser } from "@/services/userService";
import RoleBadge from "../RoleBadge";
import DetailCard from "./DetailCard";
import { DETAIL_RADIUS, ROLE_PERMISSIONS, useUserDetailsPalette } from "./detailsTheme";

/**
 * What this role is allowed to reach.
 *
 * The copy is per-role and describes only the surface that role actually has —
 * an administrator reading this is often deciding whether to change the role,
 * and a generic "full access" line would make every account look the same at
 * the exact moment the difference matters.
 */
export default function UserPermissionsCard({ user }: { user: AdminUser }) {
  const palette = useUserDetailsPalette();

  return (
    <DetailCard icon="shield" title="Roles & Permissions">
      <View
        className="my-2 gap-2.5 border p-4"
        style={{
          borderRadius: DETAIL_RADIUS.card,
          backgroundColor: palette.permissionBg,
          borderColor: palette.permissionBorder,
        }}
      >
        <RoleBadge role={user.role} />
        <Text className="text-[13px] leading-[19px]" style={{ color: palette.body }}>
          {ROLE_PERMISSIONS[user.role]}
        </Text>
      </View>
    </DetailCard>
  );
}
