import { z } from "zod";
const priorities = ["HIGH", "MEDIUM", "LOW"] as const;
const statuses = [
  "NOSTARTED",
  "PENDING",
  "STARTED",
  "COMPLETED",
  "BLOCKED",
] as const;

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "O titulo da tarefa precisa ter no mínimo 3 caracteres."),
  description: z
    .string()
    .min(3, "O descrição da precisa precisa ter no mínimo 3 caracteres.")
    .optional(),
  priority: z.enum(priorities, "Prioridade inválida. Use HIGH, MEDIUM ou LOW."),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "O titulo da tarefa precisa ter no mínimo 3 caracteres."),
  description: z
    .string()
    .min(3, "O descrição da precisa precisa ter no mínimo 3 caracteres.")
    .optional(),
  priority: z.enum(priorities, "Prioridade inválida. Use HIGH, MEDIUM ou LOW."),
  status: z
    .enum(
      statuses,
      "Status inválido. Use NOSTARTED, PENDING, COMPLETED, STARTED ou BLOCKED."
    ),
});

export const listTasksQuerySchema = z.object({
  priority: z.enum(priorities).optional(),
  status: z.enum(statuses).optional(),
  created_at: z
    .string()
    .datetime({ message: "Formato de data inválido para created_at" })
    .optional(),
  updated_at: z
    .string()
    .datetime({ message: "Formato de data inválido para updated_at" })
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(5),
});

// Inferidos tipos usando schemas do zod
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
export type ListTasksQueryDTO = z.infer<typeof listTasksQuerySchema>;