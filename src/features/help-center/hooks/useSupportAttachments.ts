import { useCallback, useState } from "react";

import { SUPPORT_LIMITS } from "../constants/support.constants";
import { validateAttachment } from "../validation/supportValidation";
import type { SupportAttachmentDraft } from "../types/support.types";

type PickedFile = {
  fileName: string;
  mimeType: string;
  fileSize: number;
  data: string;
};

export const useSupportAttachments = () => {
  const [attachments, setAttachments] = useState<SupportAttachmentDraft[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addAttachment = useCallback(
    (file: PickedFile) => {
      setError(null);

      setAttachments((current) => {
        if (current.length >= SUPPORT_LIMITS.maxAttachments) {
          setError(`You can attach up to ${SUPPORT_LIMITS.maxAttachments} files.`);
          return current;
        }

        const failure = validateAttachment(file);
        if (failure) {
          setError(failure);
          return current;
        }

        return [...current, { ...file, id: `${file.fileName}-${Date.now()}` }];
      });
    },
    []
  );

  const removeAttachment = useCallback((id: string) => {
    setError(null);
    setAttachments((current) => current.filter((item) => item.id !== id));
  }, []);

  const resetAttachments = useCallback(() => {
    setAttachments([]);
    setError(null);
  }, []);

  return { attachments, error, addAttachment, removeAttachment, resetAttachments };
};
