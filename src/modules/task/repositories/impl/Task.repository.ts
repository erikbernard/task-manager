import { Database } from "sqlite";
import { randomUUID } from "crypto";
import { Task } from "../../entities/Task";
import { ITaskRepository } from "../ITask.repository";
import { CreateTaskDTO, ListTasksQueryDTO, UpdateTaskDTO } from "../../dtos/task.dto";

export class TaskRepository implements ITaskRepository {
  constructor(private db: Database) {}

  async create(data: CreateTaskDTO, userId: string): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      title: data.title,
      description: data.description || "",
      priority: data.priority,
      status: "NOSTARTED",
      user_id: userId,
      created_at: now,
      updated_at: now,
    };

    await this.db.run(
      "INSERT INTO tasks (id, title, description, priority, status, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      task.id,
      task.title,
      task.description,
      task.priority,
      task.status,
      task.user_id,
      task.created_at,
      task.updated_at
    );
    return task;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTaskDTO
  ): Promise<Task | null> {
    const setClauses: string[] = [];
    const values: (string | number)[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        setClauses.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (setClauses.length === 0) {
      return this.findById(id, userId);
    }

    setClauses.push("updated_at = ?");
    values.push(new Date().toISOString());

    values.push(id, userId);

    const result = await this.db.run(
      `UPDATE tasks SET ${setClauses.join(", ")} WHERE id = ? AND user_id = ?`,
      ...values
    );

    if (result.changes === 0) return null;
    return this.findById(id, userId);
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const task = await this.db.get<Task>(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      id,
      userId
    );
    return task || null;
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.db.run(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      id,
      userId
    );
  }

  async findAll(
    userId: string,
    filters: ListTasksQueryDTO
  ): Promise<{ tasks: Task[]; total: number; totalPages: number,  }> {
    const { page, limit, ...filterConditions } = filters;
    const offset = (page - 1) * limit;

    let baseQuery = "FROM tasks WHERE user_id = ?";
    const params: (string | number)[] = [userId];

    Object.entries(filterConditions).forEach(([key, value]) => {
      if (value) {
        baseQuery += ` AND ${key} = ?`;
        params.push(value);
      }
    });

    // Query para contar o total de registros com os filtros
    const totalResult = await this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count ${baseQuery}`,
      ...params
    );
    const total = totalResult?.count ?? 0;
    const totalPages = Math.ceil(total / filters.limit);

    // Query para buscar os dados paginados
    const tasks = await this.db.all<Task[]>(
      `SELECT * ${baseQuery} LIMIT ? OFFSET ?`,
      ...params,
      limit,
      offset
    );
    return { tasks, total, totalPages };
  }
}
