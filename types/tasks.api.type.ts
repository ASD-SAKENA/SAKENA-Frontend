/** Response shapes of the Sakena backend task endpoints (`/api/v1/tasks`). */

export type TaskApiStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface TaskApiResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskApiStatus;
  createdAt: string;
  updatedAt: string;
}
