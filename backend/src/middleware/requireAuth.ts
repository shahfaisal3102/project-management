import type { RequestHandler } from "express";

import { AppError } from "../shared/errors/AppError.js";
import { verifyAccessToken } from "../shared/utils/token.js";

export const requireAuth: RequestHandler = async (
    req,
    _res,
    next
) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization?.startsWith("Bearer ")) {
            throw new AppError("Authentication required", 401);
        }

        const token = authorization.slice(7);

        if (!token) {
            throw new AppError("Authentication required", 401);
        }

        const payload = await verifyAccessToken(token);

        if (
            typeof payload.sub !== "string" ||
            typeof payload.email !== "string"
        ) {
            throw new AppError("Invalid access token", 401);
        }

        req.user = {
            id: payload.sub,
            email: payload.email,
        };

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
            return;
        }

        // Invalid, expired or otherwise unverifiable JWT
        next(new AppError("Invalid or expired access token", 401));
    }
};