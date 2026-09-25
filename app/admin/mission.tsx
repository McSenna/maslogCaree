import { Redirect } from "expo-router";

// Admins don't run mission scheduling; send stray visits back to the dashboard.
const AdminMission = () => <Redirect href="/admin/dashboard" />;

export default AdminMission;
