import { useState } from "react";

import { toast } from "@/components/feedback";
// The announcements CSV saver is format-agnostic: a file download on web.
import { exportAnnouncementsCsv as saveCsv } from "@/features/announcements/admin/services/exportAnnouncementsCsv";
import { toastError } from "@/utils/errorToast/toastError";

import { exportUsers } from "../services/userAdminApi";
import type { UserListParams } from "../userAdmin.types";

const fileName = (now: Date): string => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `users-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`;
};

/** Exports the current segment, search and filters from the server, so it covers every page. */
export const useUserExport = (params: Omit<UserListParams, "page" | "pageSize">) => {
  const [exporting, setExporting] = useState(false);

  const exportList = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { csv, truncated } = await exportUsers(params);
      await saveCsv(csv, fileName(new Date()));
      if (truncated) toast.info("Export stopped at 10,000 accounts", "Narrow the filters to export the rest.");
    } catch (error) {
      toastError("Could not export accounts", error);
    } finally {
      setExporting(false);
    }
  };

  return { exporting, exportList };
};
