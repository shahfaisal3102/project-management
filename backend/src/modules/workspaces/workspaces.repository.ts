import { prisma } from "../../config/database.js";

export const workspacesRepository = {
  async create(
    name: string,
    slug: string,
    userId: string
  ) {
    return prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name,
          slug,
          createdById: userId,
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: "OWNER",
        },
      });

      return workspace;
    });
  },

  async findAllByUser(userId: string) {
    return prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findByIdForUser(id: string, userId: string) {
    return prisma.workspace.findFirst({
      where: {
        id,
        members: {
          some: {
            userId,
          },
        },
      },
    });
  },

  async update(id: string, data: { name?: string; slug?: string; }) {
    return prisma.workspace.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.workspace.delete({
      where: { id },
    });
  },

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  },

  async findMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  },

  async addMember(workspaceId: string, userId: string, role: "ADMIN" | "MEMBER") {
    return prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
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
};