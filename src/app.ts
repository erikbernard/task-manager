import express from "express";
import { Database } from "sqlite";
import { errorHandler } from "./shared/middlewares/error.handler";
import { configureUserRoutes } from "./modules/users/routes/User.routes";
import { configureTaskRoutes } from "./modules/task/routes/Task.routes";

export function createApp(db: Database) {
  const app = express();
  app.use(express.json());

  const userRoutes = configureUserRoutes(db);
  const taskRoutes = configureTaskRoutes(db);

  app.use("/api", userRoutes);
  app.use("/api", taskRoutes);

  app.use(errorHandler);

  return app;
}