import express from "express";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./modules/users/users.routes.js";
import workspaceRoutes from "./modules/workspaces/workspaces.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get("/api/docs.json", (_req, res) => {
  res.json(swaggerDocument);
});

app.use(express.json());
app.use(requestLogger);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Project Management API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;