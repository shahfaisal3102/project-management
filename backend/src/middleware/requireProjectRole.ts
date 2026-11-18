import type { RequestHandler } from "express";

import { AppError } from "../shared/errors/AppError.js";
import { authorizationService } from "../modules/authorization/authorization.service.js";

export const requireProjectRole = (
    ...allowedRoles: string[]
): RequestHandler => {
    return async (req, _res, next) => {
        try {
            if (!req.user) {
                throw new AppError("Authentication required", 401);
            }

            const projectId = req.params.projectId;

            if (typeof projectId !== "string") {
                throw new AppError("Invalid project ID", 400);
            }

            await authorizationService.assertProjectRole(
                projectId,
                req.user.id,
                allowedRoles
            );

            next();
        } catch (error) {
            next(error);
        }
    };
};