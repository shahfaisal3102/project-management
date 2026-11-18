import { authRepository } from "./auth.repository.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";

import { ConflictError } from "../../shared/errors/ConflictError.js";
import { AppError } from "../../shared/errors/AppError.js";
import { generateAccessToken } from "../../shared/utils/token.js";
import { generateRefreshToken, hashRefreshToken } from "../../shared/utils/refreshToken.js";
import { authConfig } from "../../config/auth.js";

export const authService = {
    async register(input: { name: string; email: string; password: string; }) {
        const name = input.name.trim();
        const email = input.email.trim().toLowerCase();

        // 1. Check whether the user already exists
        const existingUser = await authRepository.findUserByEmail(email);

        if (existingUser) {
            throw new ConflictError(
                "An account with this email already exists"
            );
        }

        // 2. Hash the password
        const passwordHash = await hashPassword(input.password);

        // 3. Create the user
        const user = await authRepository.createUser(name, email, passwordHash);

        // 4. Return safe user information
        return user;
    },

    async login(input: { email: string; password: string; }) {
        const email = input.email.trim().toLowerCase();

        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isPasswordValid = await verifyPassword(
            user.passwordHash,
            input.password
        );

        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }

        // Generate access token
        const accessToken = await generateAccessToken({
            userId: user.id,
            email: user.email,
        });

        // Generate refresh token
        const refreshToken = generateRefreshToken();

        // Hash refresh token before database storage
        const tokenHash = hashRefreshToken(refreshToken);

        const expiresAt = new Date(
            Date.now() +
            authConfig.refreshTokenExpiresDays * 24 * 60 * 60 * 1000
        );

        await authRepository.createRefreshToken(
            tokenHash,
            user.id,
            expiresAt
        );

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    },

    async refresh(refreshToken: string) {
        const oldTokenHash = hashRefreshToken(refreshToken);

        // Find the existing valid refresh token
        const storedToken =
            await authRepository.findValidRefreshToken(oldTokenHash);

        if (!storedToken) {
            throw new AppError("Invalid or expired refresh token", 401);
        }

        // Generate replacement refresh token
        const newRefreshToken = generateRefreshToken();

        const newTokenHash = hashRefreshToken(newRefreshToken);

        const expiresAt = new Date(
            Date.now() +
            authConfig.refreshTokenExpiresDays * 24 * 60 * 60 * 1000
        );

        // Atomically revoke old token and store new token
        const rotated = await authRepository.rotateRefreshToken(
            oldTokenHash,
            newTokenHash,
            storedToken.userId,
            expiresAt
        );

        if (!rotated) {
            throw new AppError("Refresh token has already been used", 401);
        }

        // Generate a new access token
        const accessToken = await generateAccessToken({
            userId: storedToken.user.id,
            email: storedToken.user.email,
        });

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: storedToken.user,
        };
    },

    async logout(refreshToken?: string) {
        if (refreshToken) {
            const tokenHash = hashRefreshToken(refreshToken);

            await authRepository.revokeRefreshToken(tokenHash);
        }

        return true;
    },
};