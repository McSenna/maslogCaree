import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import Timeline from "@/components/ui/Timeline";
import type { TimelineStep } from "./recordPresenter";

const MedicalRecordTimeline = ({
  steps,
  palette,
}: {
  steps: TimelineStep[];
  palette: QueuePalette;
}) => {
  return <Timeline title="Record Timeline" steps={steps} palette={palette} />;
};

export default MedicalRecordTimeline;
