import { useState } from "react";

import { toast } from "@/components/feedback";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { toastError } from "@/utils/errorToast/toastError";

import type { AdminUser } from "../../../services/userService";
import { changeUserRole, updateUser, type UserEdit } from "../../services/userAdminApi";
import type { Role } from "../../userAdmin.types";
import { ROLES } from "../../userAdminModel";

const CONFLICT = 409;

export const roleOf = (apiRole: string): Role => ROLES.find((role) => role.toLowerCase() === apiRole) ?? "Resident";

/** The Edit dialog's fields. Keyed by account, so a realtime refresh never wipes what the admin is typing. */
export const useEditUser = (detail: AdminUser, onDone: () => void) => {
  const [fullname, setFullname] = useState(detail.fullname);
  const [phone, setPhone] = useState(detail.phone);
  const [address, setAddress] = useState(detail.address);
  const [role, setRole] = useState<Role>(roleOf(detail.role));
  const [saving, setSaving] = useState(false);
  const [confirmingRole, setConfirmingRole] = useState(false);

  const nameError = fullname.trim().length < 2 ? "Enter the full name, at least 2 characters." : null;
  const addressError = address.trim().length < 5 ? "Enter the address, at least 5 characters." : null;
  const roleChanged = role !== roleOf(detail.role);

  const save = async () => {
    setConfirmingRole(false);
    if (saving || nameError || addressError) return;
    const edit: UserEdit = {};
    if (fullname.trim() !== detail.fullname) edit.fullname = fullname.trim();
    if (phone.trim() !== detail.phone) edit.phone = phone.trim();
    if (address.trim() !== detail.address) edit.address = address.trim();

    setSaving(true);
    try {
      let version = detail.updatedAt;
      if (Object.keys(edit).length > 0) version = (await updateUser(detail._id, edit, version)) ?? version;
      if (roleChanged) await changeUserRole(detail._id, role, version);
      toast.success("Account saved", fullname.trim());
      onDone();
    } catch (error) {
      toastError("Account not saved", error);
      // Someone else changed it: the form is out of date, so it closes and the list reloads.
      if (normalizeApiError(error).status === CONFLICT) onDone();
    } finally {
      setSaving(false);
    }
  };

  const submit = () => {
    if (roleChanged) setConfirmingRole(true);
    else void save();
  };

  return {
    fullname, setFullname, phone, setPhone, address, setAddress, role, setRole,
    nameError, addressError, saving, submit, save, confirmingRole,
    cancelRole: () => setConfirmingRole(false),
  };
};
