import type { Request, Response, NextFunction, } from "express";
import { authService } from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import { AppError } from "../../shared/errors/AppError.js";
import { authConfig } from "../../config/auth.js";
import { refreshCookieOptions } from "../../config/cookies.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as RegisterInput;
        const user = await authService.register(input);

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as LoginInput;

        const result = await authService.login(input);

        // Store refresh token in an HTTP-only cookie
        res.cookie("refreshToken", result.refreshToken, {
            ...refreshCookieOptions,
            maxAge:
                authConfig.refreshTokenExpiresDays *
                24 *
                60 *
                60 *
                1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken: result.accessToken,
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new AppError("Authentication required", 401);
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: {
                user: req.user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (typeof refreshToken !== "string") {
            throw new AppError("Refresh token required", 401);
        }

        const result = await authService.refresh(refreshToken);

        // Replace the old cookie with the rotated token
        res.cookie("refreshToken", result.refreshToken, {
            ...refreshCookieOptions,
            maxAge:
                authConfig.refreshTokenExpiresDays * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: {
                accessToken: result.accessToken,
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        await authService.logout(
            typeof refreshToken === "string"
                ? refreshToken
                : undefined
        );

        res.clearCookie("refreshToken", refreshCookieOptions);

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        next(error);
    }
};