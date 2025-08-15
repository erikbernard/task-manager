import express from "express";
import { Database } from "sqlite";
import { errorHandler } from "./shared/middlewares/error.handler";
import { configureUserRoutes } from "./modules/users/routes/User.routes";

export function createApp(db: Database) {
  const app = express();
  app.use(express.json());

  const userRoutes = configureUserRoutes(db);
  app.use("/api", userRoutes);

  app.use(errorHandler);

  return app;
}