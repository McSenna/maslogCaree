import { View } from "react-native";
import type { ProfileInfoGroup } from "../../types/profile.types";
import ProfileInfoRow from "../ProfileInfoRow";
import ProfileSectionCard from "../ProfileSectionCard";

type OverviewTabProps = {
  groups: ProfileInfoGroup[];
  twoColumn: boolean;
  stacked: boolean;
};

const GroupCard = ({ group, stacked }: { group: ProfileInfoGroup; stacked: boolean }) => (
  <ProfileSectionCard title={group.title} icon={group.icon}>
    <View>
      {group.items.map((item, index) => (
        <ProfileInfoRow
          key={item.key}
          label={item.label}
          value={item.value}
          icon={item.icon}
          provided={item.provided}
          stacked={stacked}
          showDivider={index < group.items.length - 1}
        />
      ))}
    </View>
  </ProfileSectionCard>
);

const OverviewTab = ({ groups, twoColumn, stacked }: OverviewTabProps) => {
  if (!twoColumn) {
    return (
      <View style={{ gap: 14 }}>
        {groups.map((group) => (
          <GroupCard key={group.key} group={group} stacked={stacked} />
        ))}
      </View>
    );
  }

  const columns = [
    groups.filter((_, index) => index % 2 === 0),
    groups.filter((_, index) => index % 2 === 1),
  ];

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
      {columns.map((column, index) => (
        <View key={index} style={{ flex: 1, minWidth: 0, gap: 16 }}>
          {column.map((group) => (
            <GroupCard key={group.key} group={group} stacked={stacked} />
          ))}
        </View>
      ))}
    </View>
  );
};

export default OverviewTab;
