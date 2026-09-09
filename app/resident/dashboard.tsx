import ResidentDashboard from "@/screens/resident/ResidentDashboard";

/**
 * Resident Dashboard route.
 *
 * The screen picks its own desktop/mobile layout from the window width, so the
 * route only has to mount it.
 */
const ResidentDashboardRoute = () => <ResidentDashboard />;

export default ResidentDashboardRoute;
