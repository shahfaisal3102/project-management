import { NotFoundError } from "../../shared/errors/NotFoundError.js";
import { usersRepository } from "./users.repository.js";

export const usersService = {
  async getAllUsers() {
    const users = await usersRepository.findAll();

    return users;
  },

  async getUserById(id: string) {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  },
};