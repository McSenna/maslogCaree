import { View } from "react-native";
import ProfileActionButton from "./ProfileActionButton";

type ProfileHeaderActionsProps = {
  onEditProfile?: () => void;
  onOpenSettings?: () => void;
  stacked: boolean;
};

const ProfileHeaderActions = ({
  onEditProfile,
  onOpenSettings,
  stacked,
}: ProfileHeaderActionsProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      width: stacked ? "100%" : undefined,
    }}
  >
    <ProfileActionButton
      label="Edit Profile"
      icon="edit-2"
      variant="primary"
      onPress={onEditProfile}
      fullWidth={stacked}
    />
    <ProfileActionButton
      label="Settings"
      icon="settings"
      onPress={onOpenSettings}
      fullWidth={stacked}
    />
  </View>
);

export default ProfileHeaderActions;
