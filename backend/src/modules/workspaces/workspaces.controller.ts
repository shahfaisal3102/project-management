import type { RequestHandler } from "express";
import { AppError } from "../../shared/errors/AppError.js";
import { workspacesService } from "./workspaces.service.js";
import type { updateWorkspaceSchema } from "./workspaces.validation.js";

export const createWorkspace: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError("Authentication required", 401);
    }

    const { name, slug } = req.body;

    const workspace = await workspacesService.createWorkspace(
      name,
      slug,
      user.id
    );

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyWorkspaces: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError("Authentication required", 401);
    }

    const workspaces = await workspacesService.getMyWorkspaces(user.id);

    res.status(200).json({
      success: true,
      message: "Workspaces retrieved successfully",
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceById: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError("Authentication required", 401);
    }

    const workspaceId = req.params.id;

    if (typeof workspaceId !== "string") {
      throw new AppError("Invalid workspace ID", 400);
    }

    const workspace = await workspacesService.getWorkspaceById(
      workspaceId,
      user.id
    );

    res.status(200).json({
      success: true,
      message: "Workspace retrieved successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace: RequestHandler = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;

    if (typeof workspaceId !== "string") {
      throw new AppError("Invalid workspace ID", 400);
    }

    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const input = req.body as {
      name?: string;
      slug?: string;
    };

    const workspace = await workspacesService.updateWorkspace(
      workspaceId,
      input,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: { workspace },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace: RequestHandler = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;

    if (typeof workspaceId !== "string") {
      throw new AppError("Invalid workspace ID", 400);
    }

    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    await workspacesService.deleteWorkspace(
      workspaceId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addWorkspaceMember: RequestHandler = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;

    if (typeof workspaceId !== "string") {
      throw new AppError("Invalid workspace ID", 400);
    }

    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const input = req.body as {
      email: string;
      role?: "ADMIN" | "MEMBER";
    };

    const member = await workspacesService.addWorkspaceMember(
      workspaceId,
      input.email,
      input.role,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Workspace member added successfully",
      data: {
        member,
      },
    });
  } catch (error) {
    next(error);
  }
};