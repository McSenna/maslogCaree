import { Text, View } from "react-native";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { portalAccessLines } from "@/features/users/admin/portalAccessDisplay";
import type { WebOverride } from "@/features/users/admin/userAdmin.types";
import { setWebOverride } from "@/features/users/admin/services/userAdminApi";
import { TYPE } from "@/theme/typography";
import AccessLoadState from "./AccessLoadState";
import type { ResidentWebAccess } from "./accessTypes";
import { useAccessResource } from "./useAccessResource";

const CHOICES: readonly { override: WebOverride; label: string }[] = [
  { override: "allow", label: "Allow web access" },
  { override: "block", label: "Block web access" },
  { override: null, label: "Use global setting" },
];

const ResidentWebAccessControl = ({ residentId }: { residentId: string }) => {
  const palette = useAdminSurfacePalette();
  const remote = useAccessResource<{ access: ResidentWebAccess }>(`/admin/users/${residentId}/web-access`);
  const access = remote.data?.access;
  if (!access || remote.error) return <AccessLoadState error={Boolean(remote.error)} onRetry={remote.refetch} />;

  const lines = portalAccessLines(access.state);
  const choose = (override: WebOverride) => {
    void remote.mutate(() => setWebOverride(residentId, override, access.revision), "Resident web access saved");
  };

  return (
    <View className="gap-3 py-3">
      <Text accessibilityLiveRegion="polite" style={[TYPE.bodyStrong, { color: palette.heading }]}>
        {[lines.line1, lines.line2].filter(Boolean).join(": ")}
      </Text>
      <Text style={[TYPE.body, { color: palette.body }]}>{access.reason}</Text>
      {access.eligible ? (
        <View className="flex-row flex-wrap gap-2">
          {CHOICES.filter((choice) => choice.override !== access.override).map((choice) => (
            <DashboardButton
              key={choice.label}
              palette={palette}
              variant="secondary"
              label={choice.label}
              disabled={remote.busy}
              onPress={() => choose(choice.override)}
            />
          ))}
        </View>
      ) : null}
      <Text style={[TYPE.caption, { color: palette.muted }]}>This setting never approves, verifies or reactivates an account.</Text>
    </View>
  );
};
export default ResidentWebAccessControl;
