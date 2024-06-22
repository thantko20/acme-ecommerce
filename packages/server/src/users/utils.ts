import { roles } from "@thantko/common/types";

import { UserRepository } from "./repository";

export const makeFakeUserRepository = (): UserRepository => {
  return {
    async create(data) {
      return {
        name: data.name,
        email: data.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: "1",
        role: roles[data.role!],
      };
    },
    async findAdminByEmail() {
      return null;
    },
    async findByEmail(email) {
      return null;
    },
  };
};
