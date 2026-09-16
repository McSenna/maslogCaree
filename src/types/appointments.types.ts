export type ConsultationCategory = {
  key: string;
  label: string;
  order?: number;
  description?: string;
  residentBookable?: boolean;
  queueRole?: string;
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
  status: "pending" | "confirmed" | "declined" | "rescheduled" | "processing" | "completed";
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
  assignedBy?: { _id?: string; fullname?: string; role?: string } | null;

  approvedAt?: string | null;
  processingAt?: string | null;
  completedAt?: string | null;
  completedBy?: { _id?: string; fullname?: string; role?: string } | null;
  medicalRecord?: string | null;
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
