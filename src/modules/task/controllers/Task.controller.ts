import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/Task.service";
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from "../dtos/task.dto";
import { AuthenticatedRequest } from "../../../shared/interfaces/IAuthenticatedRequest";

export class TaskController {
  constructor(private taskService: TaskService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createTaskSchema.parse(req.body);
      const task = await this.taskService.create(
        data,
        (req as unknown as AuthenticatedRequest).userId
      );
      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateTaskSchema.parse(req.body);
      const task = await this.taskService.update(
        id,
        (req as unknown as AuthenticatedRequest).userId,
        data
      );
      return res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.taskService.delete(
        id,
        (req as unknown as AuthenticatedRequest).userId
      );
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const task = await this.taskService.findById(
        id,
        (req as unknown as AuthenticatedRequest).userId
      );
      return res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = listTasksQuerySchema.parse(req.query);
      const { tasks, total, totalPages } = await this.taskService.findAll(
        (req as unknown as AuthenticatedRequest).userId,
        filters
      );

      const response = {
        data: tasks,
        pagination: {
          totalCount: total,
          totalPages: totalPages,
          page: filters.page,
          limit: filters.limit,
        },
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
