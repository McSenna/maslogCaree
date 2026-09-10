import type { ConsultationCategory } from "@/services/appointments";
import type { CategoryDurationMap, CategoryEnabledMap } from "../utils/missionCategories";
import MissionCategoryRow from "./MissionCategoryRow";

type MissionCategoryListProps = {
  categories: ConsultationCategory[];
  enabled: CategoryEnabledMap;
  durations: CategoryDurationMap;
  onToggle: (categoryKey: string) => void;
  onDurationChange: (category: ConsultationCategory, minutes: number) => void;
};

/** The services a mission runs. Shared by the create panel and the edit sheet. */
export default function MissionCategoryList({
  categories,
  enabled,
  durations,
  onToggle,
  onDurationChange,
}: MissionCategoryListProps) {
  return (
    <>
      {categories.map((category) => (
        <MissionCategoryRow
          key={category.key}
          category={category}
          enabled={Boolean(enabled[category.key])}
          durations={durations}
          onToggle={onToggle}
          onDurationChange={onDurationChange}
        />
      ))}
    </>
  );
}
