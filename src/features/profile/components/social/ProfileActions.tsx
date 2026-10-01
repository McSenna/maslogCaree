import { View } from "react-native";
import Button from "@/components/buttons/Button";
import { SPACING } from "@/theme/spacing";

type ProfileActionsProps = {
  stretch: boolean;
  onEditProfile?: () => void;
  onBookAppointment?: () => void;
};

const ProfileActions = ({ stretch, onEditProfile, onBookAppointment }: ProfileActionsProps) => {
  if (!onEditProfile && !onBookAppointment) return null;

  // Buttons share a row until the screen is too narrow for both labels, then stack.
  const fill = stretch ? { flexGrow: 1, flexBasis: 150 } : undefined;

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SPACING.sm,
        alignSelf: stretch ? "stretch" : "auto",
      }}
    >
      {onBookAppointment ? (
        <Button
          label="Book appointment"
          icon="plus"
          onPress={onBookAppointment}
          fullWidth={stretch}
          style={fill}
        />
      ) : null}
      {onEditProfile ? (
        <Button
          label="Edit profile"
          icon="edit-2"
          variant="secondary"
          onPress={onEditProfile}
          accessibilityHint="Opens your personal information for editing"
          fullWidth={stretch}
          style={fill}
        />
      ) : null}
    </View>
  );
};

export default ProfileActions;
