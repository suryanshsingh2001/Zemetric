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
}

export interface Log {
    level: string;
    message: string;
    timestamp: number;
    response: any;  
  }