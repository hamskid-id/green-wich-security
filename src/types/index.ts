export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  unitNumber: string;
  profileImage?: string;
}

export interface Visitor {
  id: string;
  name: string;
  purpose: string;
  code: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "active" | "completed" | "cancelled";
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "warning" | "alert" | "success";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface Unit {
  id: string;
  name: string;
}

export interface Resident {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface AccessCode {
  id: string;
  code: string;
  user_id: string;
  expires_in: number;
  created_at: string;
  visitor_name: string;
  multiple_persons: boolean;
  visitor_count: number;
  status: string;
  unit: Unit;
  resident: Resident;
  purpose?: string;
  notes?: string;
  start_time?: string;
  end_time?: string;
}

export interface CodeData {
  id: string;
  code: string;
  user_id: string;
  expires_in: number;
  created_at: string;
  visitor_name: string;
  multiple_persons: string | null;
  visitor_count: number | null;
  status: string | null;
  purpose?: string;
  notes?: string;
  start_time?: string;
  end_time?: string;
}
// src/types/profile.ts
export interface Residence {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
  type: string;
  number: number;
  residence: Residence;
}

export interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  unit: Unit;
}

export interface ProfileApiResponse {
  status: string;
  message: string;
  data: ProfileData;
}

export interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
