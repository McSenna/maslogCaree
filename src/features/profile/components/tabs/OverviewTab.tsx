import { View, type LayoutChangeEvent } from "react-native";
import type { ProfileEditState } from "../../hooks/useEditProfile";
import type { ProfileInfoGroup } from "../../types/profile.types";
import ProfileInfoCard from "../ProfileInfoCard";

type OverviewTabProps = {
  groups: ProfileInfoGroup[];
  twoColumn: boolean;
  stacked: boolean;
  edit?: ProfileEditState;
  onPersonalCardLayout?: (event: LayoutChangeEvent) => void;
};

const OverviewTab = ({
  groups,
  twoColumn,
  stacked,
  edit,
  onPersonalCardLayout,
}: OverviewTabProps) => {
  const renderGroup = (group: ProfileInfoGroup) => (
    <ProfileInfoCard
      key={group.key}
      group={group}
      stacked={stacked}
      edit={edit}
      onLayout={group.key === "personal" ? onPersonalCardLayout : undefined}
    />
  );

  if (!twoColumn) {
    return <View style={{ gap: 14 }}>{groups.map(renderGroup)}</View>;
  }

  const columns = [
    groups.filter((_, index) => index % 2 === 0),
    groups.filter((_, index) => index % 2 === 1),
  ];

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
      {columns.map((column, index) => (
        <View key={index} style={{ flex: 1, minWidth: 0, gap: 16 }}>
          {column.map(renderGroup)}
        </View>
      ))}
    </View>
  );
};

export default OverviewTab;
