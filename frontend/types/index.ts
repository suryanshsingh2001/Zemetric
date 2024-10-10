export type MessageType = {
  status: number;
  data: any;
} | null;

export interface UserProfile {
  name: string;
  phoneNumber: string;
}

export interface Stats {
  smsSentInLastMinute: number;
  totalSmsSentToday: number;
  violations: number;
}

export interface Log {
  level: string;
  message: string;
  timestamp: number;
  response: any;
}

export type SortOrder = "asc" | "desc";
