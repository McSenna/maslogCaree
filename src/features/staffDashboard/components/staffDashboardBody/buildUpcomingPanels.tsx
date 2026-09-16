import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffDashboardData } from "@/services/staffDashboardService";
import type { RoleDashboardConfig } from "../../config/roleDashboardConfig";
import UpcomingCard from "../UpcomingCard";

const MIDWIFE_SPLIT_SERVICES = ["prenatal", "immunization"] as const;

export const buildUpcomingPanels = ({
  palette,
  config,
  data,
  showService,
  isMobile,
  onViewQueue,
}: {
  palette: AdminDashboardPalette;
  config: RoleDashboardConfig;
  data: StaffDashboardData;
  showService: boolean;
  isMobile: boolean;
  onViewQueue: () => void;
}) => {
  if (config.role !== "midwife") {
    return [
      <UpcomingCard
        key="upcoming"
        palette={palette}
        appointments={data.upcoming}
        showService={showService}
        limit={5}
        onViewAll={onViewQueue}
        fill={!isMobile}
      />,
    ];
  }

  return MIDWIFE_SPLIT_SERVICES.map((key) => {
    const service = data.services.find((s) => s.key === key);
    const label = service?.label ?? key;
    return (
      <UpcomingCard
        key={key}
        palette={palette}
        appointments={data.upcoming.filter((a) => a.consultationType === key)}
        title={key === "prenatal" ? "Upcoming Prenatal Visits" : "Upcoming Immunisations"}
        subtitle="Scheduled after today"
        icon={key === "prenatal" ? "heart" : "shield"}
        emptyMessage={`No ${label.toLowerCase()} appointments scheduled.`}
        showService={false}
        limit={4}
        onViewAll={onViewQueue}
        fill={!isMobile}
      />
    );
  });
};
