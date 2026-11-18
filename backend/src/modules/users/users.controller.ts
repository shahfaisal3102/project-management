import type { RequestHandler } from "express";
import { usersService } from "./users.service.js";

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await usersService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler<{ id: string }>  = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};