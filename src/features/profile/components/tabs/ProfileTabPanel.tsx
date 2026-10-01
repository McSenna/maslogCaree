import type { ProfileInsightsState, ProfileTabKey } from "../../types/profile.types";
import ActivityTab from "./ActivityTab";
import AppointmentsTab from "./AppointmentsTab";
import MedicalRecordsTab from "./MedicalRecordsTab";

type ProfileTabPanelProps = {
  activeTab: Exclude<ProfileTabKey, "overview">;
  insights: ProfileInsightsState;
  twoColumn: boolean;
  isResident: boolean;
};

const ProfileTabPanel = ({ activeTab, insights, twoColumn, isResident }: ProfileTabPanelProps) => {
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

  return (
    <ActivityTab
      activity={insights.activity}
      loading={insights.loading}
      error={insights.error}
      onRetry={insights.reload}
    />
  );
};

export default ProfileTabPanel;
