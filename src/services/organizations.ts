import api from "@/services/api";

import type { OrganizationMember } from "@/types/organization";

export const fetchOrganizationMembers = async (): Promise<
  OrganizationMember[]
> => {
  const response = await api.get<OrganizationMember[]>("/organizations");
  // The About page filters this list; anything but an array would crash it.
  return Array.isArray(response.data) ? response.data : [];
};

