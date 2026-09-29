import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

import AnnouncementDetailDialog from "./AnnouncementDetailDialog";
import {
  closeAnnouncementDetail,
  subscribeToAnnouncementDetail,
  type AnnouncementDetailRequest,
} from "./announcementDetailStore";

/** Mounted once at the root, beside `ActionDialogHost`, so any screen can open a notification's announcement. */
const AnnouncementDetailHost = () => {
  const { user } = useAuth();
  const [request, setRequest] = useState<AnnouncementDetailRequest | null>(null);

  useEffect(() => subscribeToAnnouncementDetail(setRequest), []);

  // Signing out closes whatever was open rather than leaving it over the login screen.
  useEffect(() => {
    if (!user) closeAnnouncementDetail();
  }, [user]);

  if (!request || !user) return null;

  return (
    <AnnouncementDetailDialog
      key={request.key}
      announcementId={request.announcementId}
      preview={request.preview}
      onClose={() => closeAnnouncementDetail(request.key)}
    />
  );
};

export default AnnouncementDetailHost;
