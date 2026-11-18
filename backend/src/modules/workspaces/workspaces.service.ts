import { ConflictError } from "../../shared/errors/ConflictError.js";
import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { authorizationService } from "../authorization/authorization.service.js";
import { workspacesRepository } from "./workspaces.repository.js";

export const workspacesService = {
  async createWorkspace(
    name: string,
    slug: string,
    userId: string
  ) {
    return workspacesRepository.create(name, slug, userId);
  },

  async getMyWorkspaces(userId: string) {
    return workspacesRepository.findAllByUser(userId);
  },

  async getWorkspaceById(id: string, userId: string) {
    const workspace = await workspacesRepository.findByIdForUser(
      id,
      userId
    );

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    return workspace;
  },

  async updateWorkspace(
    id: string,
    data: { name?: string; slug?: string },
    userId: string
  ) {
    await authorizationService.assertWorkspaceRole(
      id,
      userId,
      ["OWNER", "ADMIN"]
    );

    return workspacesRepository.update(id, data);
  },

  async deleteWorkspace(id: string, userId: string) {
    await authorizationService.assertWorkspaceRole(
      id,
      userId,
      ["OWNER"]
    );

    return workspacesRepository.delete(id);
  },

  async addWorkspaceMember(
    workspaceId: string,
    email: string,
    role: "ADMIN" | "MEMBER" | undefined,
    actorId: string
  ) {
    // 1. Check whether the current user can manage members.
    await authorizationService.assertWorkspaceRole(
      workspaceId,
      actorId,
      ["OWNER", "ADMIN"]
    );

    // 2. Normalize email.
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find the user.
    const user = await workspacesRepository.findUserByEmail(
      normalizedEmail
    );

    if (!user) {
      throw new NotFoundError("User with this email does not exist");
    }

    // 4. Default role.
    const memberRole = role ?? "MEMBER";

    // 5. Only OWNER can assign ADMIN.
    if (memberRole === "ADMIN") {
      await authorizationService.assertWorkspaceRole(
        workspaceId,
        actorId,
        ["OWNER"]
      );
    }

    // 6. Check duplicate membership.
    const existingMember = await workspacesRepository.findMember(
      workspaceId,
      user.id
    );

    if (existingMember) {
      throw new ConflictError(
        "User is already a member of this workspace"
      );
    }

    // 7. Create membership.
    return workspacesRepository.addMember(
      workspaceId,
      user.id,
      memberRole
    );
  },
};