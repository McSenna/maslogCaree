import MissionControlScreen from "@/screens/MissionControlScreen";

// The same screen the doctor uses, scoped by the signed-in role: a BHW sees
// only BP Checking, with no Add Mission control and no row actions, since the
// API does not let them schedule or decline.
export default MissionControlScreen;
