import { prisma } from "../../config/database.js";

export const authorizationRepository = {
    async findWorkspaceMembership(
        workspaceId: string,
        userId: string
    ) {
        return prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
            select: {
                role: true,
            },
        });
    },

    async findProjectAccess(
        projectId: string,
        userId: string
    ) {
        return prisma.project.findFirst({
            where: {
                id: projectId,
                workspace: {
                    members: {
                        some: { userId },
                    },
                },
            },
            select: {
                id: true,

                workspace: {
                    select: {
                        members: {
                            where: { userId },
                            select: {
                                role: true,
                            },
                            take: 1,
                        },
                    },
                },

                members: {
                    where: { userId },
                    select: {
                        role: true,
                    },
                    take: 1,
                },
            },
        });
    },
};