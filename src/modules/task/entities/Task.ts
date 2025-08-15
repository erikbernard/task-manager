export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "PENDING" | "COMPLETED" | "STARTED" | "BLOCKED" | "NOSTARTED";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
}
