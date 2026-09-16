import DesktopUserFilters from "./searchFilters/DesktopUserFilters";
import MobileUserFilters from "./searchFilters/MobileUserFilters";
import type { UserSearchFiltersFields } from "./searchFilters/searchFiltersProps";

type UserSearchFiltersProps = UserSearchFiltersFields & {
  isDesktop: boolean;
  resultCount?: number;
};

const UserSearchFilters = ({ isDesktop, resultCount = 0, ...filters }: UserSearchFiltersProps) => {
  return isDesktop ? (
    <DesktopUserFilters {...filters} />
  ) : (
    <MobileUserFilters {...filters} resultCount={resultCount} />
  );
};

export default UserSearchFilters;
