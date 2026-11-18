import { prisma } from "../../config/database.js";

export const authRepository = {
    async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
            },
        });
    },

    async createUser(
        name: string,
        email: string,
        passwordHash: string
    ) {
        return prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
    },
    async createRefreshToken(
        tokenHash: string,
        userId: string,
        expiresAt: Date
    ) {
        return prisma.refreshToken.create({
            data: {
                tokenHash,
                userId,
                expiresAt,
            },
        });
    },

    async findValidRefreshToken(tokenHash: string) {
        return prisma.refreshToken.findFirst({
            where: {
                tokenHash,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    },
    async rotateRefreshToken(
        oldTokenHash: string,
        newTokenHash: string,
        userId: string,
        expiresAt: Date
    ) {
        return prisma.$transaction(async (tx) => {
            // Revoke the old token only if it is still valid.
            const revoked = await tx.refreshToken.updateMany({
                where: {
                    tokenHash: oldTokenHash,
                    userId,
                    revokedAt: null,
                    expiresAt: {
                        gt: new Date(),
                    },
                },
                data: {
                    revokedAt: new Date(),
                },
            });

            // Prevent two simultaneous requests from reusing the same token.
            if (revoked.count !== 1) {
                return false;
            }

            await tx.refreshToken.create({
                data: {
                    tokenHash: newTokenHash,
                    userId,
                    expiresAt,
                },
            });

            return true;
        });
    },

    async revokeRefreshToken(tokenHash: string) {
        return prisma.refreshToken.updateMany({
            where: {
                tokenHash,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    },
};