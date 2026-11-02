/** Medical-record viewing and clinical write permissions are separate. */
export const mayWriteMedicalRecords = (user: { role: string } | null | undefined): boolean =>
  Boolean(user && ["doctor", "midwife", "bhw"].includes(user.role));
