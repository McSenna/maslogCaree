export type AppointmentProps = {
  visible: boolean;
  onClose: () => void;
  openAppointment?: () => void;
  onBooked?: () => void;
};