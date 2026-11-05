import { Redirect } from "expo-router";

/** An older address for the same records. Saved links still arrive at the one page. */
const ResidentRecords = () => <Redirect href="/resident/medical-records" />;

export default ResidentRecords;
