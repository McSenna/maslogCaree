import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { AdminUser } from "@/features/users/services/userService";

import { useUserDetailsPalette } from "../detailsTheme";
import MasterLinkDialog from "./MasterLinkDialog";
import type { MasterLinkMode } from "./useMasterLinkAction";

/**
 * Which master list record this resident account holds. The link decides
 * whose encoded medical records the resident sees, so changing it asks for a
 * reason and never touches a record.
 */
const MasterLinkRows = ({ user }: { user: AdminUser }) => {
  const palette = useUserDetailsPalette();
  const buttonPalette = useAdminSurfacePalette();
  const [mode, setMode] = useState<MasterLinkMode | null>(null);
  const linked = Boolean(user.masterResidentId);
  const canLink = user.status === "approved" || user.status === "active";

  return (
    <View className="gap-3 py-3">
      <View className="flex-row items-start gap-3" accessibilityRole="text">
        <Feather name={linked ? "link" : "minus-circle"} size={17} color={linked ? palette.enabled : palette.subtle} />
        <Text className="min-w-0 flex-1 text-[13.5px] leading-[19px]" style={{ color: palette.body }}>
          {linked
            ? `Linked to record ${user.masterResidentId}. Medical records filed under it show in this account.`
            : "Not linked. Medical records encoded from the barangay's files do not show in this account."}
        </Text>
      </View>
      {linked ? (
        <View className="items-start">
          <DashboardButton palette={buttonPalette} size="sm" variant="ghost" icon="x-circle" label="Unlink account" onPress={() => setMode("unlink")} />
        </View>
      ) : canLink ? (
        <View className="items-start">
          <DashboardButton palette={buttonPalette} size="sm" variant="secondary" icon="link" label="Link to a master list record" onPress={() => setMode("link")} />
        </View>
      ) : null}
      {mode ? <MasterLinkDialog user={user} mode={mode} onClose={() => setMode(null)} /> : null}
    </View>
  );
};

export default MasterLinkRows;
