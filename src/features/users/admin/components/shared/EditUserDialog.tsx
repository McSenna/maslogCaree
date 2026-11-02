import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import TextField from "@/components/forms/TextField";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";
import SelectMenu, { type SelectOption } from "@/components/ui/SelectMenu";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { AdminUser } from "../../../services/userService";
import { confirmCopy } from "../../confirmCopy";
import { useRemoteData } from "../../hooks/useRemoteData";
import type { ActionTarget } from "../../hooks/useRowActions";
import { fetchUserDetail } from "../../services/userAdminApi";
import type { Role } from "../../userAdmin.types";
import { useEditUser } from "./useEditUser";

const STAFF_ROLES: SelectOption<Role>[] = (["Admin", "Doctor", "Midwife", "BHW"] as const).map((role) => ({ value: role, label: role }));

const TITLE = "Edit account";

const EditForm = ({ detail, selfId, onClose, onSaved }: { detail: AdminUser; selfId: string | number | null; onClose: () => void; onSaved: () => void }) => {
  const palette = useAdminSurfacePalette();
  const form = useEditUser(detail, onSaved);
  const canChangeRole = detail.role !== "resident" && detail._id !== selfId;
  const roleCopy = confirmCopy("changeRole", detail.fullname, form.role);

  return (
    <>
      <ResponsiveDialog
        visible
        title={TITLE}
        icon="edit-2"
        onClose={onClose}
        footer={
          <View className="flex-row flex-wrap justify-end gap-2">
            <DashboardButton palette={palette} variant="secondary" label="Cancel" disabled={form.saving} onPress={onClose} />
            <DashboardButton palette={palette} variant="primary" label="Save changes" loading={form.saving} disabled={Boolean(form.nameError || form.addressError)} onPress={form.submit} />
          </View>
        }
      >
        <View className="gap-4">
          <TextField label="Full name" value={form.fullname} onChangeText={form.setFullname} error={form.nameError} autoComplete="off" required />
          <TextField label="Phone" value={form.phone} onChangeText={form.setPhone} keyboardType="phone-pad" inputMode="tel" helper="Use 11 digits, like 09171234567." autoComplete="off" />
          <TextField label="Address" value={form.address} onChangeText={form.setAddress} error={form.addressError} autoComplete="off" required />
          {canChangeRole ? (
            <View className="gap-1.5">
              <Text className="text-[15px] font-semibold text-body">Role</Text>
              <SelectMenu label="Role" value={form.role} options={STAFF_ROLES} onChange={form.setRole} />
            </View>
          ) : null}
          <Text className="text-[14.5px] text-text2">The email address is used to sign in, so it cannot be edited here.</Text>
        </View>
      </ResponsiveDialog>
      <ConfirmationModal
        visible={form.confirmingRole}
        title={roleCopy.title}
        message={roleCopy.body}
        confirmLabel={roleCopy.confirmLabel}
        destructive={roleCopy.destructive}
        onConfirm={() => void form.save()}
        onCancel={form.cancelRole}
      />
    </>
  );
};

type EditUserDialogProps = {
  target: ActionTarget | null;
  selfId: string | number | null;
  onClose: () => void;
  onSaved: () => void;
};

/** Loads the account once when it opens; a save from an outdated copy is refused by the server. */
const EditUserDialog = ({ target, selfId, onClose, onSaved }: EditUserDialogProps) => {
  const palette = useAdminSurfacePalette();
  const remote = useRemoteData<AdminUser | null>({
    key: target ? `edit:${target.id}` : "closed",
    load: () => (target ? fetchUserDetail(target.id) : Promise.resolve(null)),
  });
  if (!target) return null;

  const detail = remote.data && remote.data._id === target.id ? remote.data : null;
  if (detail) return <EditForm key={detail._id} detail={detail} selfId={selfId} onClose={onClose} onSaved={onSaved} />;

  return (
    <ResponsiveDialog visible title={TITLE} icon="edit-2" onClose={onClose}>
      {remote.error ? (
        <View className="gap-3">
          <Text accessibilityRole="alert" className="text-[16px] text-body">This account could not be loaded. Check your connection, then try again.</Text>
          <DashboardButton palette={palette} variant="secondary" label="Try again" onPress={remote.refetch} />
        </View>
      ) : (
        <Text accessibilityLiveRegion="polite" className="text-[16px] text-body">Loading the account.</Text>
      )}
    </ResponsiveDialog>
  );
};

export default EditUserDialog;
