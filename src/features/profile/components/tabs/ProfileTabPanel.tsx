import type { ProfileInfoGroup, ProfileInsightsState, ProfileTabKey } from "../../types/profile.types";
import ActivityTab from "./ActivityTab";
import AppointmentsTab from "./AppointmentsTab";
import MedicalRecordsTab from "./MedicalRecordsTab";
import OverviewTab from "./OverviewTab";

type ProfileTabPanelProps = {
  activeTab: ProfileTabKey;
  insights: ProfileInsightsState;
  groups: ProfileInfoGroup[];
  twoColumn: boolean;
  stacked: boolean;
  isResident: boolean;
};

const ProfileTabPanel = ({
  activeTab,
  insights,
  groups,
  twoColumn,
  stacked,
  isResident,
}: ProfileTabPanelProps) => {
  if (activeTab === "appointments") {
    return (
      <AppointmentsTab
        appointments={insights.appointments}
        loading={insights.loading}
        error={insights.error}
        onRetry={insights.reload}
        isResident={isResident}
        twoColumn={twoColumn}
      />
    );
  }

  if (activeTab === "records") {
    return (
      <MedicalRecordsTab
        records={insights.records}
        loading={insights.loading}
        error={insights.error}
        onRetry={insights.reload}
        twoColumn={twoColumn}
      />
    );
  }

  if (activeTab === "activity") {
    return (
      <ActivityTab
        activity={insights.activity}
        loading={insights.loading}
        error={insights.error}
        onRetry={insights.reload}
      />
    );
  }

  return <OverviewTab groups={groups} twoColumn={twoColumn} stacked={stacked} />;
};

export default ProfileTabPanel;
