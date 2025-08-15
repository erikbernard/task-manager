import { Router } from "express";
import { Database } from "sqlite";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";
import { TaskRepository } from "../repositories/impl/Task.repository";
import { TaskService } from "../services/Task.service";
import { TaskController } from "../controllers/Task.controller";

export function configureTaskRoutes(db: Database): Router {
  const router = Router();

  // Injeção de Dependências
  const taskRepository = new TaskRepository(db);
  const taskService = new TaskService(taskRepository);
  const taskController = new TaskController(taskService);

  // privadas
  router.use(authMiddleware);

  router.post("/task", (req, res, next) =>
    taskController.create(req, res, next)
  );
  router.put("/task/:id", (req, res, next) =>
    taskController.update(req, res, next)
  );
  router.delete("/task/:id", (req, res, next) =>
    taskController.delete(req, res, next)
  );
  router.get("/task/:id", (req, res, next) =>
    taskController.findById(req, res, next)
  );
  router.get("/tasks", (req, res, next) =>
    taskController.findAll(req, res, next)
  );
  return router;
}
