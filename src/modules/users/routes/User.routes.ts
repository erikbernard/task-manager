import { Router } from "express";
import { Database } from "sqlite";
import { UserRepository } from "../repositories/impl/User.repository";
import { UserService } from "../services/User.service";
import { UserController } from "../controllers/User.ccntroller";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";

export function configureUserRoutes(db: Database): Router {
  const router = Router();

  // Injeção de Dependências
  const userRepository = new UserRepository(db);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  // públicas
  router.post("/users", (req, res, next) =>
    userController.create(req, res, next)
  );
  router.post("/login", (req, res, next) =>
    userController.login(req, res, next)
  );

  // privadas
  router.get("/profile", authMiddleware, (req, res, next) =>
    userController.getProfile(req, res, next)
  );
  router.put("/users/me", authMiddleware, (req, res, next) =>
    userController.update(req, res, next)
  );
  router.put("/users/me/password", authMiddleware, (req, res, next) =>
    userController.changePassword(req, res, next)
  );
  router.delete("/users/me", authMiddleware, (req, res, next) =>
    userController.delete(req, res, next)
  );
  return router;
}