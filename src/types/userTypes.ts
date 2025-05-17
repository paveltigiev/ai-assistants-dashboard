export interface UserProfile {
  id: number;
  created_at: string;
  telegram_id: number;
  onboarded_at: string;
  role: string;
  status: string;
  workspace_id: number;
  profile: Record<string, any>;
  message_count: number;
  last_message_at: string;
  days_after_onboarding: number;
}
