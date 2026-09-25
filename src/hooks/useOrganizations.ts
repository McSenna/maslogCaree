import { useEffect, useState } from "react";

import type { OrganizationMember } from "@/types/organization";
import { fetchOrganizationMembers } from "@/services/organizations";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export const useOrganizations = () => {
  const [orgMembers, setOrgMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const members = await fetchOrganizationMembers();
        if (isMounted) setOrgMembers(members);
      } catch (e: unknown) {
        if (isMounted) {
          setError(getApiErrorMessage(e, "Unable to load organization data."));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [attempt]);

  return { orgMembers, loading, error, retry: () => setAttempt((value) => value + 1) };
};

