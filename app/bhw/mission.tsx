import BhwQueueScreen from "@/features/bhwQueue/screens/BhwQueueScreen";

// The BHW's own queue, not the shared mission screen. That one opens by
// reading `GET /mission-schedule`, which the API restricts to doctor, admin
// and midwife, so a BHW was met with a 403 alert before the page had drawn
// anything. This screen shows BP Checking — the one service routed to a BHW —
// and asks only for endpoints their role may call.
export default BhwQueueScreen;
