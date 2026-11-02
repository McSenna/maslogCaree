import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import api from "@/services/api";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { TYPE } from "@/theme/typography";
import { useAccessResource } from "./useAccessResource";
import AccessLoadState from "./AccessLoadState";
import type { ManagedDevice } from "./accessTypes";
const ManagedDevicesControl = ({ residentId }: { residentId: string }) => {
  const palette = useAdminSurfacePalette();
  const path = `/admin/users/${residentId}/devices`;
  const remote = useAccessResource<{ devices: ManagedDevice[] }>(path);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [credential, setCredential] = useState<string | null>(null);
  if (!remote.data || remote.error)
    return (
      <AccessLoadState error={Boolean(remote.error)} onRetry={remote.refetch} />
    );
  const provision = () => {
    void remote.mutate(async () => {
      const { data } = await api.post<{ credential: string }>(path, {});
      setCredential(data.credential);
    }, "Device credential created");
  };
  const revoke = (id: string) => {
    void remote.mutate(async () => {
      await api.delete(`${path}/${id}`);
      setCredential(null);
      setRevokeTarget(null);
    }, "Device credential revoked");
  };
  return (
    <View className="gap-3 py-3">
      <Text style={[TYPE.bodyStrong, { color: palette.heading }]}>
        Managed mobile devices
      </Text>
      <Text style={[TYPE.body, { color: palette.body }]}>
        Provision a credential to enable resident mobile sign-in on this device.
        Enter it under Device setup on the native login screen. The resident
        still needs their password.
      </Text>
      {credential ? (
        <View className="gap-2" accessibilityLiveRegion="polite">
          <Text style={[TYPE.bodyStrong, { color: palette.heading }]}>
            Copy this credential now. It is shown only once. Keep it private.
          </Text>
          <Text
            selectable
            className="web:break-all"
            style={[TYPE.body, { color: palette.body }]}
          >
            {credential}
          </Text>
          <DashboardButton
            palette={palette}
            label="Hide device credential"
            onPress={() => setCredential(null)}
          />
        </View>
      ) : null}
      <DashboardButton
        palette={palette}
        label="Provision mobile device"
        icon="smartphone"
        onPress={provision}
        loading={remote.busy}
      />
      <FlatList
        data={remote.data.devices}
        scrollEnabled={false}
        keyExtractor={(device) => device.id}
        ListEmptyComponent={
          <Text style={[TYPE.body, { color: palette.muted }]}>
            No devices provisioned. Provision one to enable managed mobile
            sign-in.
          </Text>
        }
        renderItem={({ item }) => (
          <View
            className="gap-2 border-t py-3"
            style={{ borderColor: palette.divider }}
          >
            <Text style={[TYPE.body, { color: palette.body }]}>
              Device {item.id.slice(-8)}:{" "}
              {item.revokedAt ? "Revoked" : "Active"}
            </Text>
            {!item.revokedAt ? (
              <DashboardButton
                palette={palette}
                label={`Revoke device ${item.id.slice(-8)}`}
                onPress={() => setRevokeTarget(item.id)}
                disabled={remote.busy}
              />
            ) : null}
          </View>
        )}
      />
      <ConfirmationModal
        visible={revokeTarget !== null}
        title="Revoke managed device?"
        message={`Device ${revokeTarget?.slice(-8) ?? ""} will be signed out. This device will need a new credential before the resident can sign in again. Other provisioned devices and web access keep their existing settings.`}
        confirmLabel="Revoke device"
        destructive
        loading={remote.busy}
        onConfirm={() => {
          if (revokeTarget) revoke(revokeTarget);
        }}
        onCancel={() => {
          if (!remote.busy) setRevokeTarget(null);
        }}
      />
    </View>
  );
};
export default ManagedDevicesControl;
