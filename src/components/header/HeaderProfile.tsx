import { useWindowDimensions } from "react-native";

import { ProfileModal } from "@/features/profile";
import LogoutConfirmModal from "@/features/profile/components/LogoutConfirmModal";
import { formatRoleLabel } from "@/utils/roleLabel";

import ProfileDropdown from "./ProfileDropdown";
import HeaderProfileTrigger from "./profile/HeaderProfileTrigger";
import { useHeaderProfileMenu } from "./profile/useHeaderProfileMenu";

type HeaderProfileProps = {
  compact: boolean;
  isDark: boolean;
  showIdentity: boolean;
  showDetails: boolean;
};

const HeaderProfile = ({
  compact,
  isDark,
  showIdentity,
  showDetails,
}: HeaderProfileProps) => {
  const { width } = useWindowDimensions();
  const menu = useHeaderProfileMenu(compact, width);

  const identityLabel = menu.user?.name ?? (menu.sessionResolved ? "Guest" : "");

  return (
    <>
      <HeaderProfileTrigger
        anchorRef={menu.anchorRef}
        user={menu.user}
        identityLabel={identityLabel}
        roleLabel={formatRoleLabel(menu.user?.role)}
        compact={compact}
        isDark={isDark}
        showIdentity={showIdentity}
        showDetails={showDetails}
        open={menu.open}
        rotate={menu.rotate}
        onPress={menu.handlePress}
      />

      <ProfileDropdown
        visible={menu.open}
        onClose={menu.closeMenu}
        anchor={menu.anchor}
        items={menu.menuItems}
        isDark={isDark}
      />

      {menu.useProfileModal ? (
        <ProfileModal visible={menu.profileOpen} onClose={menu.closeProfileModal} />
      ) : null}

      <LogoutConfirmModal
        visible={menu.logoutOpen}
        onCancel={menu.cancelLogout}
        onConfirm={menu.confirmLogout}
      />
    </>
  );
};

export default HeaderProfile;
