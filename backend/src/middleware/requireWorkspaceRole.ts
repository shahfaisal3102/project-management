import type { RequestHandler } from "express";

import { AppError } from "../shared/errors/AppError.js";
import { authorizationService } from "../modules/authorization/authorization.service.js";

export const requireWorkspaceRole = (
  ...allowedRoles: string[]
): RequestHandler => {
  return async (req, _res, next) => {
    try {
      // Authentication must happen before authorization.
      if (!req.user) {
        throw new AppError("Authentication required", 401);
      }

      const workspaceId = req.params.id;

      if (typeof workspaceId !== "string") {
        throw new AppError("Invalid workspace ID", 400);
      }

      await authorizationService.assertWorkspaceRole(
        workspaceId,
        req.user.id,
        allowedRoles
      );

      // Permission granted.
      next();
    } catch (error) {
      next(error);
    }
  };
};