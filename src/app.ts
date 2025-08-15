import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from '../swagger.json'; 
import cors from "cors"; 
import { Database } from "sqlite";
import { errorHandler } from "./shared/middlewares/error.handler";
import { configureUserRoutes } from "./modules/users/routes/User.routes";
import { configureTaskRoutes } from "./modules/task/routes/Task.routes";

export function createApp(db: Database) {
  const app = express();
  app.use(cors()); 
  app.use(express.json());

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  const userRoutes = configureUserRoutes(db);
  const taskRoutes = configureTaskRoutes(db);

  app.use("/api", userRoutes);
  app.use("/api", taskRoutes);

  app.use(errorHandler);

  return app;
}