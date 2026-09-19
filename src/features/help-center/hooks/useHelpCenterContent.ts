import { useAuth } from "@/contexts/AuthContext";

import { findRoleGuide } from "../constants/roleGuides.constants";
import { useHelpSearch } from "./useHelpSearch";
import { useSupportContact } from "./useSupportContact";

export const useHelpCenterContent = () => {
  const { user } = useAuth();

  return {
    search: useHelpSearch(),
    contact: useSupportContact(),
    roleGuide: findRoleGuide(user?.role),
  };
};
