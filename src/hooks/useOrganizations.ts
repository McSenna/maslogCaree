import { useEffect, useState } from "react";

import type { OrganizationMember } from "@/types/organization";
import { fetchOrganizationMembers } from "@/services/organizations";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export const useOrganizations = () => {
  const [orgMembers, setOrgMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setLoading(true);
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
  }, []);

  return { orgMembers, loading, error };
};

