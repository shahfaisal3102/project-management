import { AppError } from "../../shared/errors/AppError.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { authorizationRepository } from "./authorization.repository.js";

export const authorizationService = {
    async assertWorkspaceRole(
        workspaceId: string,
        userId: string,
        allowedRoles: readonly string[]
    ) {
        const membership =
            await authorizationRepository.findWorkspaceMembership(
                workspaceId,
                userId
            );

        if (!membership) {
            throw new NotFoundError("Workspace not found");
        }

        if (!allowedRoles.includes(membership.role)) {
            throw new AppError(
                "You do not have permission to perform this action",
                403
            );
        }
    },

    async assertProjectRole(
        projectId: string,
        userId: string,
        allowedRoles: readonly string[]
    ) {
        const project =
            await authorizationRepository.findProjectAccess(
                projectId,
                userId
            );

        if (!project) {
            throw new NotFoundError("Project not found");
        }

        const workspaceRole =
            project.workspace.members[0]?.role;

        const projectRole =
            project.members[0]?.role;

        // Workspace owners and admins have full project access.
        const effectiveRole =
            workspaceRole === "OWNER" || workspaceRole === "ADMIN"
                ? "MANAGER"
                : projectRole;

        // Workspace members without project membership
        // cannot access the project.
        if (!effectiveRole) {
            throw new NotFoundError("Project not found");
        }

        // Check whether the effective role is allowed.
        if (!allowedRoles.includes(effectiveRole)) {
            throw new AppError(
                "You do not have permission to perform this action",
                403
            );
        }
    },
};