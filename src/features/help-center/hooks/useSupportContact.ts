import { useEffect, useState } from "react";

import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { fetchSupportContact } from "../services/supportService";
import type { SupportContactInfo } from "../types/support.types";

export const useSupportContact = () => {
  const [contact, setContact] = useState<SupportContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const info = await fetchSupportContact();
        if (active) setContact(info);
      } catch (caught: unknown) {
        if (active) setError(getApiErrorMessage(caught));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { contact, loading, error };
};
