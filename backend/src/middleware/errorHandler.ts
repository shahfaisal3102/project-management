import type { ErrorRequestHandler } from "express";
import { AppError } from "../shared/errors/AppError.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  console.error(error);

  // Application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Prisma errors
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const prismaError = error as { code: string };

    // Unique constraint violation
    if (prismaError.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "A record with this value already exists",
      });
      return;
    }

    // Record not found during update/delete
    if (prismaError.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Requested record was not found",
      });
      return;
    }
  }

  // Unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};