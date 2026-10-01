export type ConsultationCategory = {
  key: string;
  label: string;
  order?: number;
  description?: string;
  residentBookable?: boolean;
  queueRole?: string;
  /** "weekly": its own recurring schedule (immunization), never booked on a medical mission. */
  scheduling?: "mission" | "weekly";
  durationMinutes?: number;
  durationMinutesMin?: number;
  durationMinutesMax?: number;
};

export type ServiceBreakdownRow = {
  key: string;
  label: string;
  count: number;
};

export type QueueOverview = {
  queueRole: string;
  stats: {
    today: number;
    pending: number;
    upcoming: number;
    declined: number;
  };
  statusCounts: {
    pending: number;
    confirmed: number;
    rescheduled: number;
    declined: number;
  };
  schedule: AppointmentRecord[];
  breakdown: ServiceBreakdownRow[];
};

export type ServiceProvider = {
  _id: string;
  fullname: string;
  role: string;
  profilePhoto?: string | null;
};

export type AppointmentRecord = {
  _id: string;
  consultationType: string;
  description?: string;
  additionalNotes?: string;
  preferredProvider?: { _id?: string; fullname?: string; role?: string } | null;
  status: "pending" | "confirmed" | "declined" | "rescheduled" | "processing" | "completed" | "cancelled";
  isUrgent?: boolean;
  ageTier?: number;
  prioritySortKey?: number;
  createdAt?: string;
  resident?: {
    _id?: string;
    fullname?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
  };
  missionSchedule?: {
    _id: string;
    date?: string;
    morningStart?: string;
    morningEnd?: string;
    afternoonStart?: string;
    afternoonEnd?: string;
  } | null;
  assignedCategoryKey?: string | null;
  assignedDurationMinutes?: number | null;
  slotStart?: string | null;
  slotEnd?: string | null;
  declineReason?: string;
  cancelReason?: string;
  /** Immunization only: the child the visit is for; the account holder is the parent. */
  childName?: string | null;
  childDateOfBirth?: string | null;
  /** Set when the resident rescheduled a first-slot service (immunization); sorts first in the pending queue. */
  reschedulePriorityAt?: string | null;
  assignedBy?: { _id?: string; fullname?: string; role?: string } | null;

  approvedAt?: string | null;
  processingAt?: string | null;
  completedAt?: string | null;
  completedBy?: { _id?: string; fullname?: string; role?: string } | null;
  medicalRecord?: string | { _id: string; [key: string]: unknown } | null;
  statusHistory?: {
    status: AppointmentRecord["status"];
    timestamp: string;
    changedBy?: { _id?: string; fullname?: string } | string | null;
    note?: string;
  }[];
};

export type MissionScheduleRecord = {
  _id: string;
  date: string;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  categories: { categoryKey: string; durationMinutes: number }[];
};

export type RescheduleOptionSchedule = {
  missionScheduleId: string;
  date: string;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  durationMinutes: number;
  availableSlotStarts: string[];
};

/** A day on a weekly service's own schedule, with the time the next booking would get right now. */
export type WeeklyDayOption = {
  dateKey: string;
  date: string;
  nextStart: string | null;
  openPositions: number;
  totalPositions: number;
};

export type ServiceScheduling = "mission" | "weekly";

/** Open dates for a new booking: mission days and times, or a weekly service's own days. */
export type BookingOptionsResponse = {
  consultationType: string;
  scheduling: ServiceScheduling;
  schedules: RescheduleOptionSchedule[];
  days: WeeklyDayOption[];
  intervalMinutes: number | null;
};

export type RescheduleOptionsResponse = {
  appointment: {
    _id: string;
    consultationType: string;
    status: AppointmentRecord["status"];
    slotStart?: string | null;
    slotEnd?: string | null;
    missionSchedule?: string | null;
  };
  /** True when the server assigns the chosen date's first open time instead of letting the resident pick. */
  assignsEarliestSlot?: boolean;
  scheduling?: ServiceScheduling;
  schedules: RescheduleOptionSchedule[];
  days?: WeeklyDayOption[];
};
