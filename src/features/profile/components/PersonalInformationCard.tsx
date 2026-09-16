import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { PROFILE_COLORS, PROFILE_RADIUS } from "../config/profileTheme";
import type { useEditProfile } from "../hooks/useEditProfile";
import type { ProfileField } from "../utils/profileData";
import PersonalInfoEditFields from "./PersonalInfoEditFields";
import ProfileInfoRow from "./ProfileInfoRow";
import ProfileSectionCard from "./ProfileSectionCard";

type PersonalInformationCardProps = {
  fields: ProfileField[];
  edit: ReturnType<typeof useEditProfile>;
  stacked?: boolean;
};

const EditLink = ({ onPress }: { onPress?: () => void }) => {
  if (!onPress) return null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Edit personal information"
      onPress={onPress}
      className="flex-row items-center active:opacity-75"
      style={{
        gap: 4,
        minHeight: 32,
        paddingHorizontal: 12,
        borderRadius: PROFILE_RADIUS.pill,
        backgroundColor: PROFILE_COLORS.primarySoft,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "700", color: PROFILE_COLORS.primary }}>
        Edit
      </Text>
      <Feather name="chevron-right" size={14} color={PROFILE_COLORS.primary} />
    </Pressable>
  );
};

const PersonalInformationCard = ({
  fields,
  edit,
  stacked = false,
}: PersonalInformationCardProps) => (
  <ProfileSectionCard
    title="Personal Information"
    icon="user"
    action={edit.editVisible ? null : <EditLink onPress={edit.openEditProfile} />}
  >
    {edit.editVisible ? (
      <PersonalInfoEditFields fields={fields} edit={edit} />
    ) : (
      <View>
        {fields.map((field, index) => (
          <ProfileInfoRow
            key={field.key}
            label={field.label}
            value={field.value}
            icon={field.icon}
            provided={field.provided}
            stacked={stacked}
            showDivider={index < fields.length - 1}
          />
        ))}
      </View>
    )}
  </ProfileSectionCard>
);

export default PersonalInformationCard;
