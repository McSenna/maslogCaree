import api from "@/services/api";

import type { OrganizationMember } from "@/types/organization";

export const fetchOrganizationMembers = async (): Promise<
  OrganizationMember[]
> => {
  const response = await api.get<OrganizationMember[]>("/organizations");
  return response.data;
};

