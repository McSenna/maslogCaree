import api from "@/services/api";

// Admin-only. The link decides which encoded medical records a resident sees;
// changing it never edits or deletes a record.
export const linkMasterRecord = async (userId: string, masterResidentId: string, reason: string): Promise<void> => {
  await api.patch(`/admin/users/${userId}/master-link`, { masterResidentId, reason });
};

export const unlinkMasterRecord = async (userId: string, reason: string): Promise<void> => {
  await api.post(`/admin/users/${userId}/master-unlink`, { reason });
};
