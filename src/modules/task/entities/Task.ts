export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "COMPLETED" | "STARTED" | "BLOCKED" | "NOSTARTED";
  user_id: string;
  created_at: string;
  updated_at: string;
}
